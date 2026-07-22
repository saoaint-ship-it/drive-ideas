import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import Reveal from "@/components/Reveal";
import { getAllPrefectures, getCoursesByPrefecture } from "@/lib/courses";
import { site } from "@/config/site";

type Props = { params: Promise<{ pref: string }> };

export function generateStaticParams() {
  return getAllPrefectures().map((p) => ({ pref: p.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pref = decodeURIComponent((await params).pref);
  const courses = getCoursesByPrefecture(pref);
  if (courses.length === 0) return {};
  const title = `${pref}のドライブコース${courses.length}選`;
  const description = `${pref}の絶景ドライブコースを${courses.length}本掲載。距離・所要時間・ワインディング度・立ち寄りスポットまで、実データに基づく詳細ガイド。`;
  return {
    title,
    description,
    alternates: { canonical: `/pref/${encodeURIComponent(pref)}` },
    openGraph: { title, description },
  };
}

export default async function PrefPage({ params }: Props) {
  const pref = decodeURIComponent((await params).pref);
  const courses = getCoursesByPrefecture(pref);
  if (courses.length === 0) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${pref}のドライブコース`,
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${site.url}/courses/${c.slug}`,
    })),
  };

  return (
    <div className="pb-32 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">
          <Link href="/pref" className="transition-colors hover:text-text">
            Prefectures
          </Link>
        </p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          {pref}のドライブコース
        </h1>
        <p className="mt-4 font-mono text-xs text-muted">
          {courses.length} COURSES
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-x-8 gap-y-14 px-5 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
        {courses.map((course) => (
          <Reveal key={course.slug}>
            <CourseCard course={course} />
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <Link
          href="/pref"
          className="inline-block border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          ← 他の都道府県を見る
        </Link>
      </div>
    </div>
  );
}
