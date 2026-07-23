import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import CountUp from "@/components/CountUp";
import JapanSilhouette from "@/components/JapanSilhouette";
import Reveal from "@/components/Reveal";
import { getAllCourses, getAllPrefectures } from "@/lib/courses";
import { RANKING_METRICS, getMetric, getRanking } from "@/lib/rankings";
import { roadStats } from "@/data/roadStats";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "絶景ロードの、日本記録。",
  description:
    "全国のドライブコースの実データから選んだ「日本一」の道たち。標高日本一、カーブ日本一、勾配日本一——数字で見る、日本の絶景ロードの頂点。",
  alternates: { canonical: "/records" },
};

// 各記録に付ける称号（順に表示）
const RECORD_ORDER: { key: string; title: string; badge: string }[] = [
  { key: "altitude", title: "標高、日本一。", badge: "最高到達点" },
  { key: "distance", title: "距離、日本一。", badge: "走行距離" },
  { key: "hairpins", title: "ヘアピン、日本一。", badge: "ヘアピンの数" },
  { key: "corners", title: "カーブ、日本一。", badge: "カーブの数" },
  { key: "gradient", title: "勾配、日本一。", badge: "最大勾配" },
  { key: "climb", title: "登り、日本一。", badge: "獲得標高" },
];

export default function RecordsPage() {
  const courses = getAllCourses();
  const totalCourses = courses.length;
  const totalDistance = Math.round(
    courses.reduce((s, c) => s + c.distanceKm, 0)
  );
  const prefCount = getAllPrefectures().length;
  const maxElev = Math.max(...courses.map((c) => c.maxElevationM));
  const totalHairpins = courses.reduce(
    (s, c) => s + (roadStats[c.slug]?.hairpins ?? 0),
    0
  );

  const records = RECORD_ORDER.map(({ key, title, badge }) => {
    const metric = getMetric(key)!;
    const top = getRanking(metric, 1)[0];
    return { metric, title, badge, course: top.course, value: top.value };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "絶景ロードの日本記録",
    itemListElement: records.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${r.badge}日本一: ${r.course.name}（${r.metric.format(r.value)}）`,
      url: `${site.url}/courses/${r.course.slug}`,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== ヒーロー: 夜の日本列島に数字が灯る ===== */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0a1626] bg-[radial-gradient(ellipse_75%_85%_at_65%_45%,#13294a_0%,#0a1626_55%,#060d18_100%)]">
        {/* 背後に発光する日本地図 */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.45]"
          aria-hidden
        >
          <div className="w-[130%] max-w-none translate-x-[8%] sm:w-full">
            <JapanSilhouette />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-transparent to-[#060d18]/40" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-28 md:px-8">
          <p className="label-en !text-sky-200/60">Japan Records</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.1] text-white md:text-6xl lg:text-7xl">
            絶景ロードの、
            <br />
            日本記録。
          </h1>
          <p className="mt-6 max-w-xl text-base text-sky-100/70 md:text-lg">
            全国{totalCourses}本のドライブコースの実データから選んだ、
            「日本一」の道たち。標高、カーブ、勾配——数字で見る、絶景の頂点。
          </p>

          {/* 集計スタッツ（スクロールでカウントアップ） */}
          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            <div>
              <dd className="font-display text-4xl font-medium text-white md:text-5xl">
                <CountUp to={totalCourses} />
              </dd>
              <dt className="mt-1 text-xs text-sky-200/60">収録コース</dt>
            </div>
            <div>
              <dd className="font-display text-4xl font-medium text-white md:text-5xl">
                <CountUp to={totalDistance} />
                <span className="ml-1 text-xl text-sky-200/70 md:text-2xl">
                  km
                </span>
              </dd>
              <dt className="mt-1 text-xs text-sky-200/60">走行距離の合計</dt>
            </div>
            <div>
              <dd className="font-display text-4xl font-medium text-white md:text-5xl">
                <CountUp to={prefCount} />
                <span className="ml-1 text-xl text-sky-200/70 md:text-2xl">
                  都道府県
                </span>
              </dd>
              <dt className="mt-1 text-xs text-sky-200/60">カバーエリア</dt>
            </div>
            <div>
              <dd className="font-display text-4xl font-medium text-white md:text-5xl">
                <CountUp to={maxElev} />
                <span className="ml-1 text-xl text-sky-200/70 md:text-2xl">
                  m
                </span>
              </dd>
              <dt className="mt-1 text-xs text-sky-200/60">最高到達点</dt>
            </div>
          </dl>

          <p className="mt-14 font-mono text-[0.7rem] tracking-[0.2em] text-sky-200/40">
            SCROLL ↓
          </p>
        </div>
      </section>

      {/* ===== 日本一ギャラリー ===== */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="max-w-2xl">
          <p className="label-en">Records</p>
          <h2 className="mt-3 text-3xl font-medium md:text-4xl">日本一の道</h2>
          <p className="prose-jp mt-4 text-sm text-muted">
            ルート形状と標高データから算出した、それぞれの項目で日本一のコース。
            数字をタップすると、その道の詳細ページへ。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => (
            <Reveal key={r.metric.key}>
              <Link
                href={`/courses/${r.course.slug}`}
                className="group relative block overflow-hidden bg-ink"
              >
                <div className="relative aspect-[4/5]">
                  <SmartImage
                    src={r.course.heroImage}
                    alt={r.course.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                </div>

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                  <span className="border border-white/50 px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.15em] text-white/90">
                    日本一
                  </span>
                  <span className="label-en !text-white/60">{r.title.replace("、日本一。", "")}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs text-white/60">{r.badge}</p>
                  <p className="mt-1 font-display text-5xl font-medium tabular-nums text-white md:text-6xl">
                    {r.metric.format(r.value)}
                  </p>
                  <p className="mt-3 text-sm text-white/90">
                    {r.course.prefectures.join(" / ")}
                  </p>
                  <p className="text-lg font-medium leading-snug text-white">
                    {r.course.name}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* さらなる集計 */}
        <div className="mt-16 border-t border-line pt-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            <div>
              <p className="font-display text-3xl font-medium md:text-4xl">
                <CountUp to={totalHairpins} />
              </p>
              <p className="mt-1 text-xs text-muted">全コースのヘアピン合計</p>
            </div>
            <div>
              <p className="font-display text-3xl font-medium md:text-4xl">
                <CountUp to={totalCourses} />
              </p>
              <p className="mt-1 text-xs text-muted">空撮データのある道</p>
            </div>
            <div>
              <p className="font-display text-3xl font-medium md:text-4xl">
                <CountUp to={RANKING_METRICS.length} />
              </p>
              <p className="mt-1 text-xs text-muted">ランキング指標</p>
            </div>
            <div>
              <p className="font-display text-3xl font-medium md:text-4xl">
                <CountUp to={totalDistance} />
                <span className="ml-1 text-lg text-muted md:text-xl">km</span>
              </p>
              <p className="mt-1 text-xs text-muted">走ればこれだけ</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-wrap gap-3">
          <Link
            href="/rankings"
            className="border border-line px-5 py-2.5 text-sm transition-colors hover:border-black/40"
          >
            すべてのランキングを見る →
          </Link>
          <Link
            href="/compare"
            className="border border-line px-5 py-2.5 text-sm transition-colors hover:border-black/40"
          >
            気になる道を比較する →
          </Link>
          <Link
            href="/courses"
            className="border border-line px-5 py-2.5 text-sm transition-colors hover:border-black/40"
          >
            全コースを探す →
          </Link>
        </div>
      </section>
    </div>
  );
}
