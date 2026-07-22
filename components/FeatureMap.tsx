"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { OverviewItem } from "@/components/map/providers/NeonOverviewMap";

// 特集ページ用: 紹介コースをネオン画風の1枚地図で俯瞰する。
// マーカークリックでそのコースの詳細ページへ移動する。

const NeonOverviewMap = dynamic(
  () => import("@/components/map/providers/NeonOverviewMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0a1626]">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/50">
          LOADING MAP
        </span>
      </div>
    ),
  }
);

type Props = {
  items: OverviewItem[];
};

export default function FeatureMap({ items }: Props) {
  const router = useRouter();
  return (
    <NeonOverviewMap
      items={items}
      pitch={30}
      onSelect={(slug) => router.push(`/courses/${slug}`)}
    />
  );
}
