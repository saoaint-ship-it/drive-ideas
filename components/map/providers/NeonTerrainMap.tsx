"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Source, Layer, Popup, type MapRef } from "react-map-gl/maplibre";
import type {
  StyleSpecification,
  MapLayerMouseEvent,
  Map as MaplibreMap,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { type CourseMapProps, pathBounds } from "@/components/map/types";

// 通常のコース表示に加え、動画書き出し用に外から地図を制御する入口を持つ。
// autoOrbit=false で自動回転を止め、onMapReady で地図インスタンスを渡す。
type NeonTerrainMapProps = CourseMapProps & {
  autoOrbit?: boolean; // 読み込み時の自動回転（既定ON。録画時はOFFにして外から回す）
  onMapReady?: (map: MaplibreMap) => void; // 地図の準備完了時に本体を渡す（録画制御用）
  hideSpots?: boolean; // 立ち寄りスポットの◎印を隠す（動画書き出し時に使用）
  frameScale?: number; // 録画用の引き具合。指定すると回転で見切れない正方形フィットにする（1=最小,大きいほど引き）
};

// 試作版: MapTilerの標高タイルで3D地形を描き、衛星画像を地表に貼り、
// ルートをネオン発光の線で重ねる演出マップ。立ち寄りスポットは◎印＋ホバーで写真。
// 読み込み時に上空をゆっくり自動回転し、ユーザーが操作すると止まる。
// NEXT_PUBLIC_MAPTILER_KEY が未設定の間は何も描画しない（キー無しで壊れないように）。

const TERRAIN_SOURCE_ID = "maptiler-terrain";
const SATELLITE_SOURCE_ID = "maptiler-satellite";
const SPOTS_SOURCE_ID = "spots";
const SPOTS_HIT_LAYER_ID = "spots-hit";
const ROUTE_GLOW_COLOR = "#38bdf8"; // シアンブルー（縁取り）
const ROUTE_CORE_COLOR = "#cfe8ff"; // 芯（やわらかい水色）
const SPOT_COLOR = "#7dd3fc"; // スポット印（ルートと同系の青）
const ORBIT_DEG_PER_SEC = 3.5; // 自動回転の速さ（度/秒）

function buildStyle(key: string): StyleSpecification {
  return {
    version: 8,
    sources: {
      [TERRAIN_SOURCE_ID]: {
        type: "raster-dem",
        tiles: [
          `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${key}`,
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 14,
        encoding: "mapbox",
      },
      [SATELLITE_SOURCE_ID]: {
        type: "raster",
        tiles: [
          `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${key}`,
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 20,
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: "bg",
        type: "background",
        paint: { "background-color": "#0a1626" },
      },
      {
        // 実際の色（衛星画像）を地表に。少し落ち着かせつつ暗すぎない調整
        id: "satellite",
        type: "raster",
        source: SATELLITE_SOURCE_ID,
        paint: {
          "raster-saturation": -0.12,
          "raster-contrast": 0.05,
          "raster-brightness-min": 0.05,
          "raster-brightness-max": 0.95,
        },
      },
      {
        // 起伏を少しだけ強調（衛星に立体感を足す。かけすぎないよう控えめ）
        id: "hillshade",
        type: "hillshade",
        source: TERRAIN_SOURCE_ID,
        paint: {
          "hillshade-illumination-direction": 315,
          "hillshade-exaggeration": 0.25,
          "hillshade-shadow-color": "#0a1420",
          "hillshade-highlight-color": "#dfeaf5",
          "hillshade-accent-color": "#16324d",
        },
      },
    ],
    terrain: { source: TERRAIN_SOURCE_ID, exaggeration: 1.5 },
  };
}

// 点[lng,lat]を線分ABに射影した最近点を返す（経度は緯度により縮むので係数で補正）
function projectToSegment(
  p: [number, number],
  a: [number, number],
  b: [number, number],
  kx: number
): [number, number] {
  const ax = a[0] * kx;
  const ay = a[1];
  const bx = b[0] * kx;
  const by = b[1];
  const px = p[0] * kx;
  const py = p[1];
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return [(ax + t * dx) / kx, ay + t * dy];
}

// スポット座標を、ルートライン上のいちばん近い地点へ吸着させる。
// （元の座標が道から微妙にずれていても、目印が必ず道の上に乗る）
function snapMarkersToPath(
  markers: CourseMapProps["markers"],
  path: CourseMapProps["path"]
): [number, number][] {
  if (!markers) return [];
  if (!path || path.length < 2) return markers.map((m) => [m.lng, m.lat]);
  const kx = Math.cos((path[0][1] * Math.PI) / 180);
  return markers.map((m) => {
    const P: [number, number] = [m.lng, m.lat];
    let best = P;
    let bestD = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
      const q = projectToSegment(P, path[i], path[i + 1], kx);
      const dx = (q[0] - P[0]) * kx;
      const dy = q[1] - P[1];
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = q;
      }
    }
    return best;
  });
}

export default function NeonTerrainMap({
  center,
  path,
  markers,
  spotImages,
  fitToPath = false,
  autoOrbit = true,
  onMapReady,
  hideSpots = false,
  frameScale,
}: NeonTerrainMapProps) {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const [hovered, setHovered] = useState<number | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const rafRef = useRef<number | null>(null);
  const rotatingRef = useRef(false);

  const stopOrbit = useCallback(() => {
    rotatingRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // 動画書き出しなど、外から地図を制御したい呼び出し元に本体を渡す
    onMapReady?.(map);

    // ユーザーが触ったら自動回転を止める（操作を邪魔しない）
    const onUserInteract = () => stopOrbit();
    map.on("dragstart", onUserInteract);
    map.on("mousedown", onUserInteract);
    map.on("touchstart", onUserInteract);
    map.on("wheel", onUserInteract);

    // マウスが地図の外に出たらホバー状態を解除（描画レイヤー方式は
    // mousemoveでしかホバー解除を検知できないため、外に出た時用に補完）
    map.getCanvasContainer().addEventListener("mouseleave", () => setHovered(null));

    // 自動回転OFF（録画時など）や、動きを減らす設定の人には回転しない
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!autoOrbit || reduce) return;

    rotatingRef.current = true;
    let last = performance.now();
    const step = (now: number) => {
      if (!rotatingRef.current) return;
      const dt = (now - last) / 1000;
      last = now;
      // 反時計回り（低い側から見上げていく向き）にゆっくり回す
      map.setBearing(map.getBearing() - dt * ORBIT_DEG_PER_SEC);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [stopOrbit, autoOrbit, onMapReady]);

  useEffect(() => stopOrbit, [stopOrbit]);

  // スポットのホバー判定（circleレイヤーへの当たり判定。カーソル形状も合わせて変更）
  const handleSpotsMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const f = e.features?.[0];
    const idx =
      f && typeof f.properties?.index === "number" ? f.properties.index : null;
    setHovered(idx);
    const canvas = e.target.getCanvas();
    canvas.style.cursor = idx !== null ? "pointer" : "";
  }, []);

  const handleSpotsMouseLeave = useCallback((e: MapLayerMouseEvent) => {
    setHovered(null);
    e.target.getCanvas().style.cursor = "";
  }, []);

  const initialViewState = useMemo(() => {
    if (fitToPath && path && path.length > 1) {
      const b = pathBounds(path);
      const latRef = (b[0][1] + b[1][1]) / 2;
      const kx = Math.cos((latRef * Math.PI) / 180);
      const wKm = (b[1][0] - b[0][0]) * kx;
      const hKm = b[1][1] - b[0][1];
      // 縦長のコースは長い辺が横に寝るよう視点を回し、画面いっぱいに見せる
      // （横長のコースはそのまま。いろは坂の見え方は変えない）
      const portrait = hKm > wKm * 1.2;

      // 録画モード(frameScale指定時)は、回転しても見切れないよう
      // コースを囲む正方形（対角線ベース）にフィットさせる。回転に対して不変。
      if (frameScale) {
        const cLng = (b[0][0] + b[1][0]) / 2;
        const cLat = (b[0][1] + b[1][1]) / 2;
        const wLat = (b[1][0] - b[0][0]) * kx;
        const half = (Math.hypot(wLat, hKm) / 2) * frameScale; // 緯度換算の半径
        const halfLng = half / kx;
        return {
          bounds: [
            [cLng - halfLng, cLat - half],
            [cLng + halfLng, cLat + half],
          ] as [[number, number], [number, number]],
          fitBoundsOptions: {
            padding: 30,
            pitch: 60,
            bearing: portrait ? 68 : -22,
          },
        };
      }

      return {
        bounds: b,
        fitBoundsOptions: {
          padding: portrait ? 40 : 80,
          pitch: 60,
          bearing: portrait ? 68 : -22,
        },
      };
    }
    return {
      longitude: center.lng,
      latitude: center.lat,
      zoom: 12,
      pitch: 60,
      bearing: -22,
    };
  }, [center, path, fitToPath, frameScale]);

  const routeGeoJson = useMemo(
    () =>
      path
        ? {
            type: "Feature" as const,
            properties: {},
            geometry: { type: "LineString" as const, coordinates: path },
          }
        : null,
    [path]
  );

  // スポット目印はルート上へ吸着した座標で描く
  const snappedMarkers = useMemo(
    () => snapMarkersToPath(markers, path),
    [markers, path]
  );

  // 立ち寄りスポットの◎印はルート線と同じ描画レイヤーで表示する。
  // （DOM要素のMarkerだと、地形の傾きを毎フレーム計算し直すため
  //   自動回転中にわずかな誤差でカクカク震える。GPU側の同じ描画パスに
  //   乗せることで、地形・ルート線と完全に同期して震えなくなる）
  const spotsGeoJson = useMemo(() => {
    if (!markers || markers.length === 0) return null;
    return {
      type: "FeatureCollection" as const,
      features: markers.map((m, i) => ({
        type: "Feature" as const,
        properties: { index: i },
        geometry: {
          type: "Point" as const,
          coordinates: snappedMarkers[i] ?? [m.lng, m.lat],
        },
      })),
    };
  }, [markers, snappedMarkers]);

  const mapStyle = useMemo(() => (key ? buildStyle(key) : null), [key]);

  if (!mapStyle) return null;

  // 録画時は◎印を出さない
  const showSpots = !hideSpots && spotsGeoJson;
  const hoveredMarker = hovered !== null ? markers?.[hovered] : undefined;
  const hoveredPos = hovered !== null ? snappedMarkers[hovered] : undefined;
  const hoveredImage = hovered !== null ? spotImages?.[hovered] : undefined;

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        onLoad={handleLoad}
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        maxPitch={80}
        attributionControl={{ compact: true }}
        interactiveLayerIds={showSpots ? [SPOTS_HIT_LAYER_ID] : undefined}
        onMouseMove={handleSpotsMouseMove}
        onMouseLeave={handleSpotsMouseLeave}
      >
        {routeGeoJson && (
          <Source id="route" type="geojson" data={routeGeoJson}>
            {/* いちばん外の淡い光暈 */}
            <Layer
              id="route-glow-outer"
              type="line"
              paint={{
                "line-color": ROUTE_GLOW_COLOR,
                "line-width": 15,
                "line-blur": 11,
                "line-opacity": 0.28,
              }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
            {/* 青の縁取り（このレイヤーを主役にして落ち着いた青の線に見せる） */}
            <Layer
              id="route-casing"
              type="line"
              paint={{
                "line-color": ROUTE_GLOW_COLOR,
                "line-width": 6,
                "line-blur": 1.5,
                "line-opacity": 0.95,
              }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
            {/* 芯（細く・やわらかい水色。白すぎず落ち着いた印象に） */}
            <Layer
              id="route-core"
              type="line"
              paint={{
                "line-color": ROUTE_CORE_COLOR,
                "line-width": 1.6,
                "line-opacity": 0.9,
              }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
          </Source>
        )}

        {/* 立ち寄りスポットの◎印（ルート上に吸着・目立ちすぎない・ホバーで写真） */}
        {showSpots && (
          <Source id={SPOTS_SOURCE_ID} type="geojson" data={spotsGeoJson}>
            <Layer
              id="spots-glow"
              type="circle"
              paint={{
                "circle-radius": 11,
                "circle-color": SPOT_COLOR,
                "circle-blur": 1,
                "circle-opacity": 0.35,
              }}
            />
            <Layer
              id="spots-ring"
              type="circle"
              paint={{
                "circle-radius": [
                  "case",
                  ["==", ["get", "index"], hovered ?? -1],
                  10,
                  8,
                ],
                "circle-color": "rgba(10,22,38,0.35)",
                "circle-stroke-color": SPOT_COLOR,
                "circle-stroke-width": 1.5,
              }}
            />
            <Layer
              id="spots-dot"
              type="circle"
              paint={{ "circle-radius": 2.5, "circle-color": SPOT_COLOR }}
            />
            {/* 当たり判定用（見た目には出さず、ホバーしやすいよう広めに取る） */}
            <Layer
              id={SPOTS_HIT_LAYER_ID}
              type="circle"
              paint={{ "circle-radius": 14, "circle-opacity": 0 }}
            />
          </Source>
        )}

        {hoveredMarker && hoveredPos && (
          <Popup
            longitude={hoveredPos[0]}
            latitude={hoveredPos[1]}
            anchor="bottom"
            offset={16}
            closeButton={false}
            closeOnClick={false}
            maxWidth="230px"
            className="neon-popup"
          >
            {hoveredImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hoveredImage} alt={hoveredMarker.name} />
            )}
            <p className="neon-popup-title">{hoveredMarker.name}</p>
          </Popup>
        )}
      </Map>
      {autoOrbit && (
        <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.15em] text-white/60">
          ドラッグで回転・傾き / 目印にカーソルで写真
        </div>
      )}
    </div>
  );
}
