import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import CourseExplorer from "@/components/CourseExplorer";
import { getAllCourses } from "@/lib/courses";
import { collections } from "@/data/collections";

export const metadata: Metadata = {
  title: "コースを探す",
  description:
    "全国のドライブコースをエリア・所要時間・道の種類・シーズンで絞り込み検索。",
};

export default function CoursesPage() {
  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Courses</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">コースを探す</h1>
        {/* テーマ・都道府県への入口 */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {collections.slice(0, 8).map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="border border-line px-3.5 py-1.5 text-xs transition-colors hover:border-black/40"
            >
              {col.label}
            </Link>
          ))}
          <Link
            href="/collections"
            className="px-2 py-1.5 text-xs text-muted transition-colors hover:text-text"
          >
            すべてのテーマ →
          </Link>
          <Link
            href="/pref"
            className="px-2 py-1.5 text-xs text-muted transition-colors hover:text-text"
          >
            都道府県から →
          </Link>
          <Link
            href="/rankings"
            className="px-2 py-1.5 text-xs text-muted transition-colors hover:text-text"
          >
            データで見るランキング →
          </Link>
          <Link
            href="/compare"
            className="px-2 py-1.5 text-xs text-muted transition-colors hover:text-text"
          >
            コースを比較する →
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <Suspense>
          <CourseExplorer courses={getAllCourses()} />
        </Suspense>
      </div>
    </div>
  );
}
