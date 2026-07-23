import type { Course } from "@/types/course";
import { roadStats } from "@/data/roadStats";

// /courses と /map で共通のフィルター定義とロジック

export type CourseFilter = {
  q: string; // キーワード検索（道の名前・都道府県・道の種類）
  regions: string[];
  maxDuration: number; // 分。UNLIMITED なら制限なし
  roadTypes: string[];
  difficulties: string[];
  toll: string; // "" | "無料" | "有料"
  seasons: string[];
  cars: string[];
  excludeNarrow: boolean;
  sort: string; // 並べ替えキー（"" = おすすめ順）
};

export const UNLIMITED = 240;

export const emptyFilter: CourseFilter = {
  q: "",
  regions: [],
  maxDuration: UNLIMITED,
  roadTypes: [],
  difficulties: [],
  toll: "",
  seasons: [],
  cars: [],
  excludeNarrow: false,
  sort: "",
};

// 並べ替えの選択肢。値が実データ（距離・標高・カーブ数など）に基づく。
export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "おすすめ順" },
  { value: "distance-desc", label: "距離が長い順" },
  { value: "distance-asc", label: "距離が短い順" },
  { value: "duration-asc", label: "所要時間が短い順" },
  { value: "altitude-desc", label: "最高標高が高い順" },
  { value: "hairpins-desc", label: "ヘアピンが多い順" },
  { value: "corners-desc", label: "カーブが多い順" },
  { value: "gradient-desc", label: "最大勾配がきつい順" },
];

function sortValue(c: Course, sort: string): number {
  switch (sort) {
    case "distance-desc":
    case "distance-asc":
      return c.distanceKm;
    case "duration-asc":
      return c.durationMin;
    case "altitude-desc":
      return c.maxElevationM;
    case "hairpins-desc":
      return roadStats[c.slug]?.hairpins ?? -1;
    case "corners-desc":
      return roadStats[c.slug]?.corners ?? -1;
    case "gradient-desc":
      return roadStats[c.slug]?.maxGradientPct ?? -1;
    default:
      return 0;
  }
}

export function sortCourses(courses: Course[], sort: string): Course[] {
  if (!sort) return courses;
  const asc = sort.endsWith("-asc");
  return [...courses].sort((a, b) => {
    const d = sortValue(a, sort) - sortValue(b, sort);
    return asc ? d : -d;
  });
}

export const REGION_OPTIONS = [
  "北海道",
  "東北",
  "関東",
  "中部",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄",
];

export const ROAD_TYPE_OPTIONS = [
  "峠",
  "海岸線",
  "高原",
  "湖畔",
  "街道",
  "林道",
  "橋・海上",
];

export const DIFFICULTY_OPTIONS = ["初心者向け", "中級", "上級"];
export const SEASON_OPTIONS = ["春", "初夏", "夏", "秋", "冬"];
export const CAR_OPTIONS = ["軽", "ミニバン", "スポーツ", "EV", "オープン"];

export function applyFilter(courses: Course[], f: CourseFilter): Course[] {
  const q = f.q.trim().toLowerCase();
  return courses.filter((c) => {
    if (q) {
      const hay = [
        c.name,
        c.catchcopy,
        c.region,
        c.prefectures.join(" "),
        c.roadTypes.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.regions.length > 0 && !f.regions.includes(c.region)) return false;
    if (f.maxDuration < UNLIMITED && c.durationMin > f.maxDuration) return false;
    if (
      f.roadTypes.length > 0 &&
      !c.roadTypes.some((r) => f.roadTypes.includes(r))
    )
      return false;
    if (f.difficulties.length > 0 && !f.difficulties.includes(c.difficulty))
      return false;
    if (f.toll && c.toll !== f.toll) return false;
    if (
      f.seasons.length > 0 &&
      !c.bestSeasons.some((s) => f.seasons.includes(s))
    )
      return false;
    if (f.cars.length > 0 && !c.suitableFor.some((s) => f.cars.includes(s)))
      return false;
    if (f.excludeNarrow && c.narrowRoadWarning) return false;
    return true;
  });
}

// URL <-> フィルターの相互変換（リロード・共有で復元できるようにする）
export function filterToParams(f: CourseFilter): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.sort) p.set("sort", f.sort);
  if (f.regions.length) p.set("region", f.regions.join(","));
  if (f.maxDuration < UNLIMITED) p.set("time", String(f.maxDuration));
  if (f.roadTypes.length) p.set("road", f.roadTypes.join(","));
  if (f.difficulties.length) p.set("diff", f.difficulties.join(","));
  if (f.toll) p.set("toll", f.toll);
  if (f.seasons.length) p.set("season", f.seasons.join(","));
  if (f.cars.length) p.set("car", f.cars.join(","));
  if (f.excludeNarrow) p.set("wide", "1");
  return p;
}

export function paramsToFilter(p: URLSearchParams): CourseFilter {
  const list = (key: string) =>
    p.get(key)?.split(",").filter(Boolean) ?? [];
  const time = Number(p.get("time"));
  return {
    q: p.get("q") ?? "",
    regions: list("region"),
    maxDuration: Number.isFinite(time) && time > 0 ? time : UNLIMITED,
    roadTypes: list("road"),
    difficulties: list("diff"),
    toll: p.get("toll") ?? "",
    seasons: list("season"),
    cars: list("car"),
    excludeNarrow: p.get("wide") === "1",
    sort: p.get("sort") ?? "",
  };
}

export function countActiveFilters(f: CourseFilter): number {
  return (
    (f.q.trim() ? 1 : 0) +
    f.regions.length +
    f.roadTypes.length +
    f.difficulties.length +
    f.seasons.length +
    f.cars.length +
    (f.toll ? 1 : 0) +
    (f.maxDuration < UNLIMITED ? 1 : 0) +
    (f.excludeNarrow ? 1 : 0)
  );
}
