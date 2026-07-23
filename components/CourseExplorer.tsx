"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import FilterPanel from "@/components/FilterPanel";
import {
  applyFilter,
  countActiveFilters,
  emptyFilter,
  filterToParams,
  paramsToFilter,
  sortCourses,
  SORT_OPTIONS,
  UNLIMITED,
  type CourseFilter,
} from "@/lib/filter";
import type { Course } from "@/types/course";

type Props = {
  courses: Course[];
};

export default function CourseExplorer({ courses }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filter = useMemo(
    () => paramsToFilter(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );
  const from = searchParams.get("from") ?? "";

  const setFilter = useCallback(
    (next: CourseFilter) => {
      const params = filterToParams(next);
      if (from) params.set("from", from);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, from]
  );

  const results = useMemo(
    () => sortCourses(applyFilter(courses, filter), filter.sort),
    [courses, filter]
  );

  // 空状態のとき「所要時間を広げれば何件になるか」を提示する
  const withoutTimeLimit = useMemo(
    () =>
      filter.maxDuration < UNLIMITED
        ? applyFilter(courses, { ...filter, maxDuration: UNLIMITED }).length
        : 0,
    [courses, filter]
  );

  const activeCount = countActiveFilters(filter);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      {from && (
        <p className="mb-6 border border-line bg-surface px-4 py-3 text-xs text-muted">
          「{from}」から2時間で行ける道を表示しています（試作版のためすべてのコースを対象にしています）
        </p>
      )}

      <div className="flex flex-col gap-10 md:flex-row md:gap-12">
        {/* モバイル: 上部ドロワー */}
        <div className="md:hidden">
          <button
            type="button"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex w-full items-center justify-between border border-line px-4 py-3 text-sm"
          >
            <span>
              絞り込み
              {activeCount > 0 && (
                <span className="ml-2 font-mono text-xs text-signal">
                  {activeCount}
                </span>
              )}
            </span>
            <span className="font-mono text-xs text-muted">
              {drawerOpen ? "CLOSE" : "OPEN"}
            </span>
          </button>
          {drawerOpen && (
            <div className="border-x border-b border-line px-4 pb-4">
              <FilterPanel filter={filter} onChange={setFilter} />
            </div>
          )}
        </div>

        {/* デスクトップ: 左サイドバー */}
        <aside className="hidden w-64 shrink-0 md:block" aria-label="絞り込み">
          <div className="sticky top-20">
            <div className="flex items-baseline justify-between">
              <h2 className="label-en">Filter</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter(emptyFilter)}
                  className="text-xs text-muted underline hover:text-text"
                >
                  すべて解除
                </button>
              )}
            </div>
            <FilterPanel filter={filter} onChange={setFilter} />
          </div>
        </aside>

        {/* 結果 */}
        <div className="min-w-0 flex-1">
          {/* キーワード検索＋並べ替え */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <label htmlFor="course-search" className="sr-only">
                キーワードで探す
              </label>
              <input
                id="course-search"
                type="search"
                value={filter.q}
                onChange={(e) => setFilter({ ...filter, q: e.target.value })}
                placeholder="道の名前・都道府県で検索"
                className="w-full border border-line bg-transparent px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-black/40 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <label
                htmlFor="course-sort"
                className="whitespace-nowrap text-xs text-muted"
              >
                並べ替え
              </label>
              <select
                id="course-sort"
                value={filter.sort}
                onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
                className="border border-line bg-ink px-2.5 py-2.5 text-sm text-text focus:border-black/40 focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="font-mono text-xs text-muted" aria-live="polite">
            {results.length} COURSES
          </p>

          {results.length > 0 ? (
            <div className="mt-6 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-line px-6 py-16 text-center">
              <p className="text-sm">条件に一致する道はありません。</p>
              {withoutTimeLimit > 0 ? (
                <button
                  type="button"
                  onClick={() => setFilter({ ...filter, maxDuration: UNLIMITED })}
                  className="mt-4 text-sm text-muted underline hover:text-text"
                >
                  所要時間の上限をなくすと {withoutTimeLimit} 件見つかります
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setFilter(emptyFilter)}
                  className="mt-4 text-sm text-muted underline hover:text-text"
                >
                  条件をすべて解除する
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
