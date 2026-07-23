import Link from "next/link";
import { getTopRanksForCourse } from "@/lib/rankings";

// コース詳細ページに置く「全国◯位」バッジ。
// そのコースが上位（10位以内）に入っている指標だけを、順位の高い順に表示する。
// クリックすると該当のランキングページへ移動できる（データベースらしい回遊動線）。
export default function CourseRankBadges({ slug }: { slug: string }) {
  const ranks = getTopRanksForCourse(slug);
  if (ranks.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {ranks.map(({ metric, rank, total, value }) => (
        <Link
          key={metric.key}
          href={`/rankings/${metric.key}`}
          className="group inline-flex items-baseline gap-1.5 border border-signal/40 bg-signal/[0.06] px-2.5 py-1.5 text-xs transition-colors hover:bg-signal/10"
          title={`${metric.short}: 全${total}コース中${rank}位（${metric.format(value)}）`}
        >
          <span className="font-mono font-medium text-signal">
            全国{rank}位
          </span>
          <span className="text-text/70">{metric.short}</span>
          <span className="font-mono text-[0.65rem] text-muted">
            {metric.format(value)}
          </span>
        </Link>
      ))}
    </div>
  );
}
