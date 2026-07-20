import { courses as coursesBase } from "@/data/courses";
import { coursesExtra } from "@/data/courses-extra";
import { coursesExtra2 } from "@/data/courses-extra2";
import { coursesExtra3 } from "@/data/courses-extra3";
import { coursesExtra4 } from "@/data/courses-extra4";
import { coursesExtra5 } from "@/data/courses-extra5";
import type { Course, Region } from "@/types/course";

// データ取得層。ページからは必ずこの関数経由でアクセスする
// （将来CMSに差し替えるときはこのファイルだけを書き換える）

const courses: Course[] = [
  ...coursesBase,
  ...coursesExtra,
  ...coursesExtra2,
  ...coursesExtra3,
  ...coursesExtra4,
  ...coursesExtra5,
];

export function getAllCourses(): Course[] {
  return courses;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByRegion(region: Region, excludeSlug?: string): Course[] {
  return courses.filter(
    (c) => c.region === region && c.slug !== excludeSlug
  );
}

export function getRelatedCourses(course: Course, limit = 3): Course[] {
  const sameRegion = getCoursesByRegion(course.region, course.slug);
  if (sameRegion.length >= limit) return sameRegion.slice(0, limit);
  // 同じ地方で足りなければ他地方から補充
  const others = courses.filter(
    (c) => c.slug !== course.slug && !sameRegion.includes(c)
  );
  return [...sameRegion, ...others].slice(0, limit);
}

export function getCoursesByMonth(month: number): Course[] {
  return courses.filter((c) => c.bestMonths.includes(month));
}

export function getFeaturedCourses(limit = 3): Course[] {
  return courses.slice(0, limit);
}

export function getCoursesBySlugs(slugs: string[]): Course[] {
  return slugs
    .map((s) => getCourseBySlug(s))
    .filter((c): c is Course => Boolean(c));
}
