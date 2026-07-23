import type { Course } from "@/types/course";
import { getAllCourses } from "@/lib/courses";
import { roadStats } from "@/data/roadStats";

// 「似ているコース」レコメンド。
// 距離・標高・獲得標高・ワインディング・カーブ数・ヘアピン数・最大勾配を
// データセット全体で0〜1に正規化し、道の種類の重なり(Jaccard)も加味して、
// 走りの性格が近い道を算出する（同じ地方かどうかではなく、数値プロファイルの近さ）。

type NumKey =
  | "distance"
  | "duration"
  | "maxElev"
  | "gain"
  | "winding"
  | "hairpins"
  | "corners"
  | "gradient";

type Feat = Record<NumKey, number> & { roadTypes: string[] };

const NUM_KEYS: NumKey[] = [
  "distance",
  "duration",
  "maxElev",
  "gain",
  "winding",
  "hairpins",
  "corners",
  "gradient",
];

// 走りの「性格」に効く軸を重めにする
const WEIGHTS: Record<NumKey, number> = {
  distance: 0.6,
  duration: 0.4,
  maxElev: 1.0,
  gain: 0.8,
  winding: 1.0,
  hairpins: 1.0,
  corners: 0.8,
  gradient: 0.8,
};
const ROAD_WEIGHT = 1.5;

function toFeat(c: Course): Feat {
  const s = roadStats[c.slug];
  return {
    distance: c.distanceKm,
    duration: c.durationMin,
    maxElev: c.maxElevationM,
    gain: c.elevationGainM,
    winding: c.windingLevel,
    hairpins: s?.hairpins ?? 0,
    corners: s?.corners ?? 0,
    gradient: s?.maxGradientPct ?? 0,
    roadTypes: c.roadTypes,
  };
}

// モジュール読み込み時に一度だけ、全コースの特徴量と各軸のレンジを計算する
const allCourses = getAllCourses();
const featBySlug = new Map<string, Feat>(
  allCourses.map((c) => [c.slug, toFeat(c)])
);
const ranges: Record<NumKey, { min: number; max: number }> = Object.fromEntries(
  NUM_KEYS.map((k) => [k, { min: Infinity, max: -Infinity }])
) as Record<NumKey, { min: number; max: number }>;
for (const f of featBySlug.values()) {
  for (const k of NUM_KEYS) {
    if (f[k] < ranges[k].min) ranges[k].min = f[k];
    if (f[k] > ranges[k].max) ranges[k].max = f[k];
  }
}

function norm(k: NumKey, v: number): number {
  const { min, max } = ranges[k];
  return max > min ? (v - min) / (max - min) : 0;
}

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const uni = new Set([...a, ...b]).size;
  return uni ? inter / uni : 0;
}

// course に似ているコースを、近い順に limit 件返す
export function getSimilarCourses(course: Course, limit = 3): Course[] {
  const fa = featBySlug.get(course.slug);
  if (!fa) return [];

  const scored = allCourses
    .filter((c) => c.slug !== course.slug)
    .map((c) => {
      const fb = featBySlug.get(c.slug)!;
      let sum = 0;
      let wsum = 0;
      for (const k of NUM_KEYS) {
        const w = WEIGHTS[k];
        const d = norm(k, fa[k]) - norm(k, fb[k]);
        sum += w * d * d;
        wsum += w;
      }
      const roadD = 1 - jaccard(fa.roadTypes, fb.roadTypes);
      sum += ROAD_WEIGHT * roadD * roadD;
      wsum += ROAD_WEIGHT;
      return { course: c, dist: Math.sqrt(sum / wsum) };
    })
    .sort((a, b) => a.dist - b.dist);

  return scored.slice(0, limit).map((s) => s.course);
}
