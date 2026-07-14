import type { Metadata } from "next";
import { Suspense } from "react";
import CourseExplorer from "@/components/CourseExplorer";
import { getAllCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "コースを探す",
  description:
    "全国のドライブコースをエリア・所要時間・道の種類・シーズンで絞り込み検索。",
};

export default function CoursesPage() {
  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Courses</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">コースを探す</h1>
      </div>
      <div className="mt-10">
        <Suspense>
          <CourseExplorer courses={getAllCourses()} />
        </Suspense>
      </div>
    </div>
  );
}
