import type { Course, Closure } from "@/types/course";
import { getAllCourses } from "@/lib/courses";

// 通行規制(closure)を持つ全コースを集約する。
// /closures ページと、他ページからの「規制情報まとめ」導線で使う。

export type ClosureEntry = { course: Course; closure: Closure };

export function getAllClosures(): ClosureEntry[] {
  return getAllCourses()
    .filter((c): c is Course & { closure: Closure } => Boolean(c.closure))
    .map((c) => ({ course: c, closure: c.closure! }));
}

export function getClosuresByType(type: Closure["type"]): ClosureEntry[] {
  return getAllClosures().filter((e) => e.closure.type === type);
}

// 期間文字列から開始月を推測する(並べ替え用の目安。表示には使わない)。
// 例: "11月上旬〜4月下旬" -> 11 / "12月頃〜4月頃" -> 12
export function guessStartMonth(period: string): number {
  const m = period.match(/(\d{1,2})月/);
  return m ? Number(m[1]) : 13; // 見つからなければ最後に回す
}
