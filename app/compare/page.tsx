import type { Metadata } from "next";
import { Suspense } from "react";
import CompareTool from "@/components/CompareTool";
import { getAllCompareCourses } from "@/lib/compare";

export const metadata: Metadata = {
  title: "コースを比較する",
  description:
    "気になるドライブコースを2〜4つ選んで、距離・標高・カーブ数・最大勾配などを横並びで比較。数字で選べるドライブデータベース。",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Compare</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          コースを比較する
        </h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          気になる道を2〜4つ選んで、距離・標高・カーブ数・勾配などを横並びで見比べられます。
          「どっちがきつい峠？」「どっちが長い？」を数字で確認できます。
        </p>
      </div>

      <div className="mt-10">
        <Suspense>
          <CompareTool courses={getAllCompareCourses()} />
        </Suspense>
      </div>
    </div>
  );
}
