import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getAllPrefectures } from "@/lib/courses";

export const metadata: Metadata = {
  title: "都道府県から探す",
  description:
    "都道府県ごとのドライブコース一覧。お住まいの地域や旅行先から絶景ロードを探せます。",
};

export default function PrefIndexPage() {
  const prefs = getAllPrefectures();

  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Prefectures</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          都道府県から探す
        </h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          お住まいの地域や旅行先の都道府県から、走りたい道を探せます。
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-3 px-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:px-8">
        {prefs.map((p) => (
          <Reveal key={p.name}>
            <Link
              href={`/pref/${encodeURIComponent(p.name)}`}
              className="group flex items-center justify-between border border-line px-5 py-4 transition-colors hover:border-black/40"
            >
              <span className="text-sm font-medium">{p.name}</span>
              <span className="font-mono text-xs text-muted transition-colors group-hover:text-text">
                {p.count} →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
