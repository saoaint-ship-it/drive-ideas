import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import {
  RANKING_METRICS,
  getMetric,
  getRanking,
} from "@/lib/rankings";
import { site } from "@/config/site";

type Props = { params: Promise<{ metric: string }> };

export function generateStaticParams() {
  return RANKING_METRICS.map((m) => ({ metric: m.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metric: key } = await params;
  const metric = getMetric(key);
  if (!metric) return {};
  const top = getRanking(metric, 1)[0];
  const title = `${metric.label} ランキング`;
  const description = top
    ? `${metric.lead} 1位は${top.course.name}（${metric.format(top.value)}）。`
    : metric.lead;
  return {
    title,
    description,
    alternates: { canonical: `/rankings/${metric.key}` },
  };
}

// 1〜3位の順位表示スタイル
function rankBadgeClass(rank: number): string {
  if (rank === 1) return "border-signal bg-signal text-white";
  if (rank <= 3) return "border-signal/50 text-signal";
  return "border-line text-muted";
}

export default async function RankingMetricPage({ params }: Props) {
  const { metric: key } = await params;
  const metric = getMetric(key);
  if (!metric) notFound();

  const ranking = getRanking(metric);
  const maxValue = ranking.length > 0 ? ranking[0].value : 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${metric.label} ランキング`,
    numberOfItems: ranking.length,
    itemListElement: ranking.slice(0, 20).map((r) => ({
      "@type": "ListItem",
      position: r.rank,
      name: `${r.course.name}（${metric.format(r.value)}）`,
      url: `${site.url}/courses/${r.course.slug}`,
    })),
  };

  return (
    <div className="pb-32 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <Link href="/rankings" className="text-muted hover:text-text">
            ランキング
          </Link>
          <span className="text-muted">/</span>
          <span className="text-muted">{metric.short}</span>
        </div>

        <p className="label-en mt-6">{metric.labelEn}</p>
        <h1 className="mt-2 text-3xl font-medium md:text-4xl">{metric.label}</h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          {metric.lead}
        </p>

        {/* 他の指標への切り替えタブ */}
        <div className="mt-8 flex flex-wrap gap-2">
          {RANKING_METRICS.map((m) => (
            <Link
              key={m.key}
              href={`/rankings/${m.key}`}
              className={`border px-3 py-1.5 text-xs transition-colors ${
                m.key === metric.key
                  ? "border-signal bg-signal/10 text-signal"
                  : "border-line text-muted hover:border-black/30 hover:text-text"
              }`}
            >
              {m.short}
            </Link>
          ))}
        </div>

        {/* ランキング本体 */}
        <ol className="mt-10 space-y-2">
          {ranking.map(({ course, value, rank }) => {
            const pct = maxValue > 0 ? Math.max(6, (value / maxValue) * 100) : 0;
            return (
              <li key={course.slug}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="group flex items-center gap-4 border border-line p-3 transition-colors hover:border-black/40 md:gap-5 md:p-4"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border font-mono text-sm font-medium tabular-nums ${rankBadgeClass(
                      rank
                    )}`}
                  >
                    {rank}
                  </span>

                  <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden bg-surface sm:block">
                    <SmartImage
                      src={course.heroImage}
                      alt={course.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium transition-colors group-hover:text-signal">
                      {course.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {course.prefectures.join(" / ")}
                    </p>
                    {/* 相対値バー（1位を100%とした割合） */}
                    <div className="mt-2 h-1 w-full bg-line/60">
                      <div
                        className="h-full bg-signal/60"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <span className="shrink-0 text-right font-mono text-base tabular-nums md:text-lg">
                    {metric.format(value)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <p className="prose-jp mt-10 text-xs text-muted">※ {metric.note}</p>

        <div className="mt-8">
          <Link
            href="/rankings"
            className="text-sm text-muted underline-offset-4 hover:text-text hover:underline"
          >
            ← すべてのランキングを見る
          </Link>
        </div>
      </div>
    </div>
  );
}
