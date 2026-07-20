"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";

// 動画書き出し用の全画面ページ（サイトのヘッダー等を出さず、地図だけを大きく表示）。
// /studio?slug=ororon-line のように使う。ナビには載せず、外部ツール(録画スクリプト)から開く。
// autoOrbit=false にして、回転と録画は外部スクリプト側で制御する。

const NeonTerrainMap = dynamic(
  () => import("@/components/map/providers/NeonTerrainMap"),
  { ssr: false }
);

function StudioInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "ororon-line";
  // 引き具合（大きいほど引き。回転で見切れないよう既定でやや引き）
  const scale = Number(sp.get("scale") ?? "1.25");
  // spots=0 で立ち寄りスポットの◎を隠す（動画では既定で非表示）
  const hideSpots = sp.get("spots") !== "1";
  const course = getCourseBySlug(slug);

  if (!course) {
    return (
      <div style={{ color: "#e0f7ff", padding: 24 }}>コースが見つかりません: {slug}</div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#0a1626" }}>
      <NeonTerrainMap
        center={course.center}
        path={course.path}
        markers={course.spots}
        fitToPath
        slug={course.slug}
        autoOrbit={false}
        hideSpots={hideSpots}
        frameScale={Number.isFinite(scale) && scale > 0 ? scale : 1.25}
        onMapReady={(map) => {
          const w = window as unknown as {
            __neonMap?: unknown;
            __mapReady?: boolean;
          };
          w.__neonMap = map;
          w.__mapReady = true;
        }}
      />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <StudioInner />
    </Suspense>
  );
}
