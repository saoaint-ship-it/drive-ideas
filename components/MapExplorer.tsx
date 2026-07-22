"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterPanel from "@/components/FilterPanel";
import SpecMeter from "@/components/SpecMeter";
import SmartImage from "@/components/SmartImage";
import ClosureBadge from "@/components/ClosureBadge";
import {
  applyFilter,
  countActiveFilters,
  emptyFilter,
  filterToParams,
  paramsToFilter,
  type CourseFilter,
} from "@/lib/filter";
import type { Course } from "@/types/course";

type Props = {
  courses: Course[];
};

// 空撮動画と同じネオン画風の俯瞰マップ(クライアント側でのみ描画)
const NeonOverviewMap = dynamic(
  () => import("@/components/map/providers/NeonOverviewMap"),
  { ssr: false }
);

// 日本全体が収まる初期表示
const JAPAN_CENTER = { lat: 38.5, lng: 137.0 };
const JAPAN_ZOOM = 4.3;

export default function MapExplorer({ courses }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const filter = useMemo(
    () => paramsToFilter(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const setFilter = useCallback(
    (next: CourseFilter) => {
      const qs = filterToParams(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  const results = useMemo(
    () => applyFilter(courses, filter),
    [courses, filter]
  );

  const selected = useMemo(
    () => results.find((c) => c.slug === selectedSlug) ?? null,
    [results, selectedSlug]
  );

  const items = useMemo(
    () =>
      results.map((c) => ({
        slug: c.slug,
        name: c.name,
        lat: c.center.lat,
        lng: c.center.lng,
        path: c.path,
      })),
    [results]
  );

  const activeCount = countActiveFilters(filter);

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full overflow-hidden">
      {/* 地図本体(空撮動画と同じネオン画風) */}
      <div className="absolute inset-0">
        <NeonOverviewMap
          items={items}
          center={JAPAN_CENTER}
          zoom={JAPAN_ZOOM}
          onSelect={(slug) => setSelectedSlug(slug)}
        />
      </div>

      {/* 上部バー: 件数 + フィルター開閉 */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <button
          type="button"
          aria-expanded={filterOpen}
          onClick={() => setFilterOpen((v) => !v)}
          className="flex items-center gap-2 border border-line bg-ink/90 px-4 py-2.5 text-sm backdrop-blur-sm"
        >
          絞り込み
          {activeCount > 0 && (
            <span className="font-mono text-xs text-signal">{activeCount}</span>
          )}
        </button>
        <p className="border border-line bg-ink/90 px-3 py-2.5 font-mono text-xs text-muted backdrop-blur-sm">
          {results.length} COURSES
        </p>
      </div>

      {/* フィルターパネル（地図上のオーバーレイ） */}
      {filterOpen && (
        <div className="absolute bottom-0 left-0 top-16 z-20 w-full overflow-y-auto border-r border-line bg-ink/95 px-5 pb-8 backdrop-blur-sm md:w-80">
          <div className="flex items-baseline justify-between pt-4">
            <h2 className="label-en">Filter</h2>
            <div className="flex gap-4">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter(emptyFilter)}
                  className="text-xs text-muted underline hover:text-text"
                >
                  すべて解除
                </button>
              )}
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="font-mono text-xs text-muted hover:text-text"
              >
                CLOSE
              </button>
            </div>
          </div>
          <FilterPanel filter={filter} onChange={setFilter} />
        </div>
      )}

      {/* プレビューカード: モバイルは下から / デスクトップは右側 */}
      {selected && (
        <aside
          aria-label={`${selected.name}のプレビュー`}
          className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-ink/95 backdrop-blur-sm md:inset-x-auto md:right-4 md:top-16 md:bottom-4 md:w-96 md:border md:border-line"
        >
          <div className="flex items-start justify-between px-5 pt-4">
            <p className="label-en">{selected.prefectures.join(" / ")}</p>
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              aria-label="プレビューを閉じる"
              className="font-mono text-xs text-muted hover:text-text"
            >
              CLOSE
            </button>
          </div>

          <div className="px-5 pb-5">
            <h2 className="mt-1 text-xl font-medium">{selected.name}</h2>
            <p className="mt-1 text-xs text-muted">{selected.catchcopy}</p>

            <div className="img-hover relative mt-4 hidden aspect-[3/2] md:block">
              <SmartImage
                src={selected.heroImage}
                alt={selected.name}
                fill
                sizes="384px"
                className="object-cover"
              />
              {selected.closure && (
                <div className="absolute left-3 top-3">
                  <ClosureBadge closure={selected.closure} />
                </div>
              )}
            </div>

            <div className="mt-4">
              <SpecMeter course={selected} compact />
            </div>

            <Link
              href={`/courses/${selected.slug}`}
              className="mt-5 block border border-line px-4 py-3 text-center text-sm transition-colors hover:border-black/40"
            >
              コース詳細を見る
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
