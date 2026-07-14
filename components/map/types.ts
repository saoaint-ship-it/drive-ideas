import type { SpotType } from "@/types/course";

// 地図プロバイダに依存しない共通props。
// ページからは CourseMap だけを使い、実装(MapLibre / Google)は内部で切り替える
export type CourseMapProps = {
  center: { lat: number; lng: number };
  path?: [number, number][]; // [lng, lat] ルートライン
  markers?: { lat: number; lng: number; type: SpotType; name: string }[];
  zoom?: number;
  onMarkerClick?: (name: string) => void;
  fitToPath?: boolean;
};

// ルートライン・マーカーの見た目は両プロバイダで揃える
export const ROUTE_COLOR = "#D8433A";
export const ROUTE_WIDTH = 3;

export function pathBounds(
  path: [number, number][]
): [[number, number], [number, number]] {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;
  for (const [lng, lat] of path) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}
