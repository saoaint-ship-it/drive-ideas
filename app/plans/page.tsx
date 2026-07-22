import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import { plans } from "@/data/plans";
import { getCourseBySlug } from "@/lib/courses";

export const metadata: Metadata = {
  title: "日帰りモデルプラン",
  description:
    "出発時刻から立ち寄りまで、そのまま走れる日帰りドライブのモデルプラン集。東京発・関西発・札幌発など、絶景ロードを組み合わせた1日の設計図。",
};

export default function PlansPage() {
  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Model Plans</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          日帰りモデルプラン
        </h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          「どの道を、どの順番で、何時に走るか」まで組んだ1日の設計図です。
          時刻はすべて目安。自分のペースに合わせて調整してください。
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-5 md:grid-cols-2 lg:grid-cols-3 md:px-8">
        {plans.map((plan) => {
          const hero = getCourseBySlug(plan.courseSlugs[0]);
          return (
            <Reveal key={plan.slug}>
              <Link
                href={`/plans/${plan.slug}`}
                className="group block border border-line transition-colors hover:border-black/40"
              >
                {hero && (
                  <div className="img-hover relative aspect-[16/9]">
                    <SmartImage
                      src={hero.heroImage}
                      alt={plan.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="label-en">{plan.origin}発</p>
                  <p className="mt-2 text-lg font-medium leading-snug">
                    {plan.title}
                  </p>
                  <p className="prose-jp mt-2 line-clamp-2 text-xs text-muted">
                    {plan.catchcopy}
                  </p>
                  <p className="mt-4 font-mono text-xs text-muted">
                    {plan.totalKmApprox} / {plan.courseSlugs.length}コース
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
