import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import { collections } from "@/data/collections";
import { getAllCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "テーマから探す",
  description:
    "天空ルート・海が見える道・紅葉ドライブなど、目的やテーマから全国のドライブコースを探せます。",
};

export default function CollectionsPage() {
  const courses = getAllCourses();

  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Collections</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">テーマから探す</h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          「今日はどんな道を走りたいか」から選べるテーマ別のコース集です。全
          {courses.length}コースを、景色・走り味・季節で切り取りました。
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
        {collections.map((col) => {
          const matched = courses.filter(col.filter);
          const cover = matched[0];
          return (
            <Reveal key={col.slug}>
              <Link
                href={`/collections/${col.slug}`}
                className="group block border border-line transition-colors hover:border-black/40"
              >
                {cover && (
                  <div className="img-hover relative aspect-[16/9]">
                    <SmartImage
                      src={cover.heroImage}
                      alt={col.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">{col.label}</p>
                    <p className="font-mono text-xs text-muted">
                      {matched.length} COURSES
                    </p>
                  </div>
                  <p className="prose-jp mt-2 line-clamp-2 text-xs text-muted">
                    {col.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
