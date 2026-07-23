import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getAllCourses } from "@/lib/courses";
import { RANKING_METRICS, getRanking } from "@/lib/rankings";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "データで見るランキング",
  description:
    "ヘアピンの数・最大勾配・最高標高・距離など、ルート形状と標高データから算出した指標で全国のドライブコースをランキング。数字で選ぶドライブデータベース。",
  alternates: { canonical: "/rankings" },
};

// 順位ごとの色分け（1〜3位を強調）
function rankClass(rank: number): string {
  if (rank === 1) return "text-signal";
  if (rank <= 3) return "text-text";
  return "text-muted";
}

export default function RankingsPage() {
  const total = getAllCourses().length;

  // 一覧向けのItemList構造化データ（各ランキングの1位を代表として）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ドライブコース ランキング",
    itemListElement: RANKING_METRICS.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.label,
      url: `${site.url}/rankings/${m.key}`,
    })),
  };

  return (
    <div className="pb-32 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Rankings</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          データで見るランキング
        </h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          全{total}コースを、ルート形状と標高データから算出した数値でランキング。
          「一番ヘアピンが多い峠は？」「一番標高が高い道は？」——
          感覚ではなくデータで選べるのが、このデータベースの強みです。
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8">
        {RANKING_METRICS.map((metric) => {
          const top = getRanking(metric, 5);
          return (
            <Reveal key={metric.key}>
              <div className="flex h-full flex-col border border-line">
                <div className="flex items-baseline justify-between border-b border-line px-5 py-4">
                  <div>
                    <p className="label-en">{metric.labelEn}</p>
                    <h2 className="mt-1 text-lg font-medium">{metric.label}</h2>
                  </div>
                </div>

                <ol className="flex-1 divide-y divide-line">
                  {top.map(({ course, value, rank }) => (
                    <li key={course.slug}>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface"
                      >
                        <span
                          className={`w-6 shrink-0 font-mono text-sm font-medium tabular-nums ${rankClass(
                            rank
                          )}`}
                        >
                          {rank}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium transition-colors group-hover:text-signal">
                            {course.name}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {course.prefectures.join(" / ")}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-sm tabular-nums">
                          {metric.format(value)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>

                <div className="border-t border-line px-5 py-3">
                  <Link
                    href={`/rankings/${metric.key}`}
                    className="text-xs text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                  >
                    ランキングをすべて見る（全{top.length > 0 ? getRanking(metric).length : 0}位まで）→
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-5 md:px-8">
        <p className="prose-jp text-xs text-muted">
          ※
          ヘアピン数・カーブ数・最大勾配はルート形状と公開標高データ（ASTER
          GDEM）から自動計算した目安値です。実際の道路標識や計測値とは異なる場合があります。
        </p>
      </div>
    </div>
  );
}
