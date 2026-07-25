import type { Course } from "@/types/course";
import { getAllCourses } from "@/lib/courses";
import { roadStats } from "@/data/roadStats";

// データに基づくランキングの定義とロジック。
// 数値はすべて実データ（ルート形状・標高プロファイル・スペック）から算出しており、
// /rankings 各ページ、コース詳細ページの「全国◯位」バッジ、絞り込みの並べ替えで共通に使う。

export type RankingMetric = {
  key: string; // URLスラッグ
  label: string; // ランキングの見出し（日本語）
  short: string; // バッジ・チップ用の短い語
  labelEn: string;
  unit: string;
  lead: string; // ランキングページのリード文
  note: string; // 数値の出どころ・注意書き
  value: (c: Course) => number | null; // 対象外は null
  format: (v: number) => string;
  sort?: "asc" | "desc"; // 既定はdesc（値が大きいほど1位）。ascなら値が小さいほど1位
};

export const RANKING_METRICS: RankingMetric[] = [
  {
    key: "hairpins",
    label: "ヘアピンカーブが多い道",
    short: "ヘアピンの多さ",
    labelEn: "Most Hairpins",
    unit: "箇所",
    lead: "切り返すように曲がるヘアピンカーブの数が多い順。峠の走りごたえ、そして車窓が次々と切り替わる面白さの指標。",
    note: "ルート形状から自動計算した、累積回転150°以上のヘアピンカーブの数。",
    value: (c) => roadStats[c.slug]?.hairpins ?? null,
    format: (v) => `${v.toLocaleString()}箇所`,
  },
  {
    key: "corners",
    label: "カーブが多い道",
    short: "カーブの多さ",
    labelEn: "Most Corners",
    unit: "箇所",
    lead: "60°以上の明確なカーブ（ヘアピンを含む）が多い順。ワインディングのテクニカルさ、走らせて楽しい道の指標。",
    note: "ルート形状から自動計算した、60°以上のカーブの数。",
    value: (c) => roadStats[c.slug]?.corners ?? null,
    format: (v) => `${v.toLocaleString()}箇所`,
  },
  {
    key: "gradient",
    label: "勾配がきつい道",
    short: "最大勾配",
    labelEn: "Steepest Grade",
    unit: "%",
    lead: "コースに含まれる最大勾配が急な順。一気に高度を稼ぐ登坂路・下り坂の指標。",
    note: "標高データの区間平均から求めた最大勾配の目安。実際の瞬間勾配より小さめに出る。",
    value: (c) => roadStats[c.slug]?.maxGradientPct ?? null,
    format: (v) => `約${v}%`,
  },
  {
    key: "altitude",
    label: "標高が高い道",
    short: "最高標高",
    labelEn: "Highest Point",
    unit: "m",
    lead: "コース上の最高到達標高が高い順。雲海や星空に近い「天空のドライブ」の指標。",
    note: "コース区間中の最高到達標高（メートル）。",
    value: (c) => c.maxElevationM,
    format: (v) => `${v.toLocaleString()}m`,
  },
  {
    key: "distance",
    label: "距離が長い道",
    short: "距離",
    labelEn: "Longest Route",
    unit: "km",
    lead: "走破区間の距離が長い順。景色の移り変わりを長く楽しめる、ロングクルーズ向きの道。",
    note: "紹介している走破区間の距離（キロメートル）。",
    value: (c) => c.distanceKm,
    format: (v) => `${v.toLocaleString()}km`,
  },
  {
    key: "climb",
    label: "獲得標高が大きい道",
    short: "獲得標高",
    labelEn: "Most Climbing",
    unit: "m",
    lead: "スタートから登った標高の合計（獲得標高）が大きい順。登りごたえのある山岳ルートの指標。",
    note: "スタート地点から登った標高の合計（メートル）。",
    value: (c) => c.elevationGainM,
    format: (v) => `${v.toLocaleString()}m`,
  },
  {
    key: "spots",
    label: "立ち寄りスポットが多い道",
    short: "スポットの多さ",
    labelEn: "Most Spots",
    unit: "件",
    lead: "展望台・道の駅・撮影ポイントなど、立ち寄りスポットの登録数が多い順。休憩や写真映えする場所に困らない道の指標。",
    note: "コースページに登録している立ち寄りスポットの件数。",
    value: (c) => c.spots.length,
    format: (v) => `${v.toLocaleString()}件`,
  },
  {
    key: "quick",
    label: "気軽に走れる道",
    short: "所要時間の短さ",
    labelEn: "Quickest Drive",
    unit: "分",
    lead: "休憩なしの走破時間が短い順。「ちょっと走りたい」ときにすぐ楽しめる、気軽なドライブの指標。",
    note: "休憩を含まない走破時間の目安（分）。短いほど上位。",
    value: (c) => c.durationMin,
    format: (v) => {
      if (v < 60) return `${v}分`;
      const h = Math.floor(v / 60);
      const m = v % 60;
      return m === 0 ? `${h}時間` : `${h}時間${m}分`;
    },
    sort: "asc",
  },
];

export function getMetric(key: string): RankingMetric | undefined {
  return RANKING_METRICS.find((m) => m.key === key);
}

export type RankedCourse = { course: Course; value: number; rank: number };

// 指定指標での全コースの順位。値が大きいほど上位。
// 同値は同順位（標準的な競技順位: 1,2,2,4…）。
export function getRanking(metric: RankingMetric, limit?: number): RankedCourse[] {
  const dir = metric.sort === "asc" ? 1 : -1;
  const rows = getAllCourses()
    .map((c) => ({ course: c, value: metric.value(c) }))
    .filter((r): r is { course: Course; value: number } => r.value !== null)
    .sort((a, b) => (a.value - b.value) * dir);

  const ranked: RankedCourse[] = [];
  rows.forEach((r, i) => {
    const rank =
      i > 0 && rows[i - 1].value === r.value ? ranked[i - 1].rank : i + 1;
    ranked.push({ course: r.course, value: r.value, rank });
  });
  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

export type CourseRank = {
  metric: RankingMetric;
  rank: number;
  total: number;
  value: number;
};

// あるコースが上位に入っている指標を集める（詳細ページの「全国◯位」バッジ用）。
// within位以内のものだけを、順位が高い順に最大max件返す。
export function getTopRanksForCourse(
  slug: string,
  within = 10,
  max = 3
): CourseRank[] {
  const out: CourseRank[] = [];
  for (const metric of RANKING_METRICS) {
    const ranking = getRanking(metric);
    const hit = ranking.find((r) => r.course.slug === slug);
    if (hit && hit.rank <= within) {
      out.push({
        metric,
        rank: hit.rank,
        total: ranking.length,
        value: hit.value,
      });
    }
  }
  return out.sort((a, b) => a.rank - b.rank).slice(0, max);
}
