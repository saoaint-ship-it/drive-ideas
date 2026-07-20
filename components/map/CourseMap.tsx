"use client";

import dynamic from "next/dynamic";
import type { CourseMapProps } from "@/components/map/types";

// ページから使う唯一の地図入口。
// NEXT_PUBLIC_MAP_PROVIDER=google | maplibre で実装を切り替える（未設定時は maplibre）。
// GoogleのAPIキーが無い場合も maplibre にフォールバックし、キーなしで必ず動く。

const MapLibreMap = dynamic(
  () => import("@/components/map/providers/MapLibreMap"),
  { ssr: false, loading: () => <MapLoading /> }
);

const GoogleMap = dynamic(
  () => import("@/components/map/providers/GoogleMap"),
  { ssr: false, loading: () => <MapLoading /> }
);

const NeonTerrainMap = dynamic(
  () => import("@/components/map/providers/NeonTerrainMap"),
  { ssr: false, loading: () => <MapLoading /> }
);

// ネオン3D空撮マップは全コースで既定使用。
// 特定コースで表示に問題が出た場合だけ、そのslugをここに足せば通常のマップ(Google/MapLibre)に戻る
const NEON_TERRAIN_EXCLUDE_SLUGS = new Set<string>([]);

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface">
      <span className="font-mono text-[10px] tracking-[0.3em] text-muted">
        LOADING MAP
      </span>
    </div>
  );
}

export default function CourseMap(props: CourseMapProps) {
  const provider = process.env.NEXT_PUBLIC_MAP_PROVIDER ?? "maplibre";
  const hasGoogleKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  if (props.slug && !NEON_TERRAIN_EXCLUDE_SLUGS.has(props.slug)) {
    return <NeonTerrainMap {...props} />;
  }
  if (provider === "google" && hasGoogleKey) {
    return <GoogleMap {...props} />;
  }
  return <MapLibreMap {...props} />;
}
