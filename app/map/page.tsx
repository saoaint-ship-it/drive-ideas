import type { Metadata } from "next";
import { Suspense } from "react";
import MapExplorer from "@/components/MapExplorer";
import { getAllCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "全国マップ",
  description: "全国のドライブコースを地図から探す。",
};

export default function MapPage() {
  return (
    <div className="pt-14">
      <Suspense>
        <MapExplorer courses={getAllCourses()} />
      </Suspense>
    </div>
  );
}
