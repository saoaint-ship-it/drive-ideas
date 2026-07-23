import type { Course } from "@/types/course";
import { getAllCourses } from "@/lib/courses";
import { roadStats } from "@/data/roadStats";

// コース比較（/compare）で使う、クライアントに渡す軽量なコースデータと行定義。
// 詳細ページのデータをそのまま渡すと重いので、比較に必要な項目だけに絞る。

export type CompareCourse = {
  slug: string;
  name: string;
  prefectures: string[];
  region: string;
  heroImage: string;
  distanceKm: number;
  durationMin: number;
  elevationGainM: number;
  maxElevationM: number;
  windingLevel: number;
  difficulty: string;
  toll: string;
  bestSeasons: string[];
  roadTypes: string[];
  narrowRoadWarning: boolean;
  hairpins: number | null;
  corners: number | null;
  maxGradientPct: number | null;
};

export function toCompareCourse(c: Course): CompareCourse {
  const s = roadStats[c.slug];
  return {
    slug: c.slug,
    name: c.name,
    prefectures: c.prefectures,
    region: c.region,
    heroImage: c.heroImage,
    distanceKm: c.distanceKm,
    durationMin: c.durationMin,
    elevationGainM: c.elevationGainM,
    maxElevationM: c.maxElevationM,
    windingLevel: c.windingLevel,
    difficulty: c.difficulty,
    toll: c.toll,
    bestSeasons: c.bestSeasons,
    roadTypes: c.roadTypes,
    narrowRoadWarning: c.narrowRoadWarning,
    hairpins: s?.hairpins ?? null,
    corners: s?.corners ?? null,
    maxGradientPct: s?.maxGradientPct ?? null,
  };
}

export function getAllCompareCourses(): CompareCourse[] {
  return getAllCourses().map(toCompareCourse);
}

// 比較表の1行の定義。
// kind "num": 数値。選んだコースの中で最大の値を強調し、相対バーを描く。
// kind "text": 文字（難易度・料金など）。強調・バーはなし。
export type CompareRow = {
  key: string;
  label: string;
  kind: "num" | "text";
  num?: (c: CompareCourse) => number | null;
  text?: (c: CompareCourse) => string;
  format?: (v: number) => string;
};

function formatDuration(min: number): string {
  if (min < 60) return `${min}分`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}時間` : `${h}時間${m}分`;
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    key: "distance",
    label: "距離",
    kind: "num",
    num: (c) => c.distanceKm,
    format: (v) => `${v.toLocaleString()}km`,
  },
  {
    key: "duration",
    label: "所要時間の目安",
    kind: "num",
    num: (c) => c.durationMin,
    format: (v) => formatDuration(v),
  },
  {
    key: "maxElevation",
    label: "最高標高",
    kind: "num",
    num: (c) => c.maxElevationM,
    format: (v) => `${v.toLocaleString()}m`,
  },
  {
    key: "elevationGain",
    label: "獲得標高",
    kind: "num",
    num: (c) => c.elevationGainM,
    format: (v) => `${v.toLocaleString()}m`,
  },
  {
    key: "winding",
    label: "ワインディング",
    kind: "num",
    num: (c) => c.windingLevel,
    format: (v) => `レベル${v} / 5`,
  },
  {
    key: "corners",
    label: "カーブ数",
    kind: "num",
    num: (c) => c.corners,
    format: (v) => `${v.toLocaleString()}箇所`,
  },
  {
    key: "hairpins",
    label: "うちヘアピン",
    kind: "num",
    num: (c) => c.hairpins,
    format: (v) => `${v.toLocaleString()}箇所`,
  },
  {
    key: "gradient",
    label: "最大勾配",
    kind: "num",
    num: (c) => c.maxGradientPct,
    format: (v) => `約${v}%`,
  },
  {
    key: "difficulty",
    label: "難易度",
    kind: "text",
    text: (c) => c.difficulty,
  },
  {
    key: "toll",
    label: "料金",
    kind: "text",
    text: (c) => c.toll,
  },
  {
    key: "roadTypes",
    label: "道の種類",
    kind: "text",
    text: (c) => c.roadTypes.join("・"),
  },
  {
    key: "seasons",
    label: "ベストシーズン",
    kind: "text",
    text: (c) => c.bestSeasons.join("・"),
  },
  {
    key: "narrow",
    label: "車幅注意",
    kind: "text",
    text: (c) => (c.narrowRoadWarning ? "あり" : "—"),
  },
  {
    key: "area",
    label: "エリア",
    kind: "text",
    text: (c) => c.prefectures.join("・"),
  },
];

export const COMPARE_MAX = 4;
