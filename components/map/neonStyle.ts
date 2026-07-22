import type { StyleSpecification } from "maplibre-gl";

// 空撮動画と同じ「ネオン画風」の地図スタイル定義。
// NeonTerrainMap(コース詳細の3D)と NeonOverviewMap(全国・特集の俯瞰)で共有する。

export const NEON_BG = "#0a1626"; // ダークネイビーの背景
export const ROUTE_GLOW_COLOR = "#38bdf8"; // シアンブルー(縁取り)
export const ROUTE_CORE_COLOR = "#cfe8ff"; // 芯(やわらかい水色)
export const SPOT_COLOR = "#7dd3fc"; // 目印(ルートと同系の青)

export const TERRAIN_SOURCE_ID = "maptiler-terrain";
export const SATELLITE_SOURCE_ID = "maptiler-satellite";

export function buildNeonStyle(
  key: string,
  opts: { terrain?: boolean } = {}
): StyleSpecification {
  const { terrain = true } = opts;
  const style: StyleSpecification = {
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
        paint: { "background-color": NEON_BG },
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
  };
  if (terrain) {
    style.terrain = { source: TERRAIN_SOURCE_ID, exaggeration: 1.5 };
  }
  return style;
}
