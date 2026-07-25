import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ClosureBadge from "@/components/ClosureBadge";
import { getAllClosures, guessStartMonth } from "@/lib/closures";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "冬季閉鎖・通行規制まとめ",
  description:
    "冬季閉鎖や夜間通行止め、時間帯規制のある全国のドライブコースを一覧化。出発前のルート確認にどうぞ。",
  alternates: { canonical: "/closures" },
};

const TYPE_ORDER = ["冬季閉鎖", "夜間通行止め", "時間帯規制"] as const;
const TYPE_LABEL_EN: Record<string, string> = {
  冬季閉鎖: "Winter Closure",
  夜間通行止め: "Night Closure",
  時間帯規制: "Time Restriction",
};
const TYPE_LEAD: Record<string, string> = {
  冬季閉鎖:
    "積雪・凍結のため、例年11月頃〜4月頃を中心に通行できなくなる道です。開通・閉鎖の時期は年によって前後します。",
  夜間通行止め: "夜間の一定時間帯だけ通行できなくなる道です。日没前後の到着時刻に注意してください。",
  時間帯規制: "波・火山活動など状況に応じて、時間帯や区間が規制されることがある道です。",
};

export default function ClosuresPage() {
  const all = getAllClosures();

  const groups = TYPE_ORDER.map((type) => ({
    type,
    entries: all
      .filter((e) => e.closure.type === type)
      .sort(
        (a, b) =>
          guessStartMonth(a.closure.period) - guessStartMonth(b.closure.period)
      ),
  })).filter((g) => g.entries.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "冬季閉鎖・通行規制まとめ",
    itemListElement: all.slice(0, 50).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${e.course.name}（${e.closure.type}）`,
      url: `${site.url}/courses/${e.course.slug}`,
    })),
  };

  return (
    <div className="pb-32 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="label-en">Road Status</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          冬季閉鎖・通行規制まとめ
        </h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          全{all.length}コースに通行規制の情報があります。山岳路・高原ルートは積雪期に閉鎖されることが多いため、出発前にこのページと公式情報で最新の状況を確認してください。
        </p>
        <p className="mt-3 text-xs text-signal">
          ※ 期間は例年の目安です。年や天候によって前後します。走行前に必ず道路管理者の公式発表をご確認ください。
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-4xl px-5 md:px-8">
        {groups.map((g) => (
          <section key={g.type} className="mb-16 last:mb-0">
            <p className="label-en">{TYPE_LABEL_EN[g.type]}</p>
            <h2 className="mt-2 text-2xl font-medium">{g.type}</h2>
            <p className="prose-jp mt-3 max-w-xl text-sm text-muted">
              {TYPE_LEAD[g.type]}
            </p>

            <ul className="mt-8 divide-y divide-line border-t border-b border-line">
              {g.entries.map(({ course, closure }) => (
                <Reveal key={course.slug} as="li">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="group flex flex-col gap-2 px-1 py-5 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="label-en">{course.prefectures.join(" / ")}</p>
                      <p className="mt-1 text-lg font-medium transition-colors group-hover:text-signal">
                        {course.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                      <ClosureBadge closure={closure} />
                      <p className="text-xs text-muted">{closure.period}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mx-auto mt-4 max-w-4xl px-5 md:px-8">
        <Link
          href="/courses"
          className="text-sm text-muted underline-offset-4 hover:text-text hover:underline"
        >
          ← すべてのコースを見る
        </Link>
      </div>
    </div>
  );
}
