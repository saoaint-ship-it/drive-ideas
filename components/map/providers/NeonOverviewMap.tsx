"use client";

import { useCallback, useMemo, useState } from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  buildNeonStyle,
  ROUTE_GLOW_COLOR,
  ROUTE_CORE_COLOR,
  SPOT_COLOR,
} from "@/components/map/neonStyle";

// 空撮動画と同じネオン画風で、複数コースをまとめて俯瞰する地図。
// 全国マップ(/map)と特集ページ(/features)で使う。
// 各コースの中心に発光マーカー、ルートは細いネオンラインで描く。

export type OverviewItem = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  path?: [number, number][];
};

type Props = {
  items: OverviewItem[];
  // 未指定なら items 全体にフィット
  center?: { lat: number; lng: number };
  zoom?: number;
  pitch?: number;
  onSelect?: (slug: string) => void;
};

const MARKER_LAYER_ID = "overview-markers-hit";

export default function NeonOverviewMap({
  items,
  center,
  zoom,
  pitch = 0,
  onSelect,
}: Props) {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const [hovered, setHovered] = useState<string | null>(null);

  const mapStyle = useMemo(
    () => (key ? buildNeonStyle(key, { terrain: false }) : null),
    [key]
  );

  const initialViewState = useMemo(() => {
    if (center && zoom !== undefined) {
      return { longitude: center.lng, latitude: center.lat, zoom, pitch };
    }
    // itemsの範囲にフィット
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    for (const it of items) {
      if (it.lng < minLng) minLng = it.lng;
      if (it.lat < minLat) minLat = it.lat;
      if (it.lng > maxLng) maxLng = it.lng;
      if (it.lat > maxLat) maxLat = it.lat;
    }
    return {
      bounds: [
        [minLng, minLat],
        [maxLng, maxLat],
      ] as [[number, number], [number, number]],
      fitBoundsOptions: { padding: 60, pitch },
    };
  }, [items, center, zoom, pitch]);

  // 全コースのルートを1つのFeatureCollectionに
  const routesGeoJson = useMemo(() => {
    const features = items
      .filter((it) => it.path && it.path.length > 1)
      .map((it) => ({
        type: "Feature" as const,
        properties: { slug: it.slug },
        geometry: { type: "LineString" as const, coordinates: it.path! },
      }));
    return features.length
      ? { type: "FeatureCollection" as const, features }
      : null;
  }, [items]);

  // コース中心の発光マーカー
  const markersGeoJson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: items.map((it) => ({
        type: "Feature" as const,
        properties: { slug: it.slug, name: it.name },
        geometry: {
          type: "Point" as const,
          coordinates: [it.lng, it.lat],
        },
      })),
    }),
    [items]
  );

  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const f = e.features?.[0];
    const slug = (f?.properties?.slug as string) ?? null;
    setHovered(slug);
    e.target.getCanvas().style.cursor = slug ? "pointer" : "";
  }, []);

  const handleMouseLeave = useCallback((e: MapLayerMouseEvent) => {
    setHovered(null);
    e.target.getCanvas().style.cursor = "";
  }, []);

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const slug = e.features?.[0]?.properties?.slug as string | undefined;
      if (slug && onSelect) onSelect(slug);
    },
    [onSelect]
  );

  if (!mapStyle) return null;

  const hoveredItem = hovered
    ? items.find((it) => it.slug === hovered)
    : undefined;

  return (
    <div className="relative h-full w-full">
      <Map
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
        interactiveLayerIds={[MARKER_LAYER_ID]}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {routesGeoJson && (
          <Source id="overview-routes" type="geojson" data={routesGeoJson}>
            <Layer
              id="overview-route-glow"
              type="line"
              paint={{
                "line-color": ROUTE_GLOW_COLOR,
                "line-width": 6,
                "line-blur": 4,
                "line-opacity": 0.35,
              }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
            <Layer
              id="overview-route-core"
              type="line"
              paint={{
                "line-color": ROUTE_CORE_COLOR,
                "line-width": 1.4,
                "line-opacity": 0.9,
              }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
          </Source>
        )}

        <Source id="overview-markers" type="geojson" data={markersGeoJson}>
          {/* 外側の淡い光 */}
          <Layer
            id="overview-markers-glow"
            type="circle"
            paint={{
              "circle-radius": 10,
              "circle-color": SPOT_COLOR,
              "circle-blur": 1,
              "circle-opacity": 0.35,
            }}
          />
          {/* 輪郭リング */}
          <Layer
            id="overview-markers-ring"
            type="circle"
            paint={{
              "circle-radius": [
                "case",
                ["==", ["get", "slug"], hovered ?? ""],
                8,
                6,
              ],
              "circle-color": "rgba(10,22,38,0.5)",
              "circle-stroke-color": SPOT_COLOR,
              "circle-stroke-width": 1.5,
            }}
          />
          {/* 中心点 */}
          <Layer
            id="overview-markers-dot"
            type="circle"
            paint={{ "circle-radius": 2, "circle-color": SPOT_COLOR }}
          />
          {/* 当たり判定(見えない・広め) */}
          <Layer
            id={MARKER_LAYER_ID}
            type="circle"
            paint={{ "circle-radius": 14, "circle-opacity": 0 }}
          />
        </Source>
      </Map>

      {/* ホバー中のコース名 */}
      {hoveredItem && (
        <div className="pointer-events-none absolute left-3 bottom-3 border border-white/20 bg-[#0a1626]/90 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
          {hoveredItem.name}
        </div>
      )}
    </div>
  );
}
