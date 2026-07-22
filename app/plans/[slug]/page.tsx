import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import CourseCard from "@/components/CourseCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { plans, getPlanBySlug } from "@/data/plans";
import { getCoursesBySlugs, getCourseBySlug } from "@/lib/courses";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return plans.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const plan = getPlanBySlug(slug);
  if (!plan) return {};
  return {
    title: plan.title,
    description: plan.description,
    alternates: { canonical: `/plans/${plan.slug}` },
    openGraph: { title: plan.title, description: plan.description },
  };
}

export default async function PlanPage({ params }: Props) {
  const { slug } = await params;
  const plan = getPlanBySlug(slug);
  if (!plan) notFound();

  const courses = getCoursesBySlugs(plan.courseSlugs);
  const hero = courses[0];

  return (
    <article className="pb-32">
      {/* ヒーロー */}
      <section className="relative h-[60vh] w-full">
        {hero && (
          <SmartImage
            src={hero.heroImage}
            alt={plan.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
          <p className="label-en">Model Plan / {plan.origin}発</p>
          <h1 className="mt-4 text-3xl font-medium leading-tight md:text-5xl">
            {plan.title}
          </h1>
          <p className="mt-4 text-base text-text/80 md:text-lg">
            {plan.catchcopy}
          </p>
        </div>
      </section>

      {/* 基本情報 */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line py-8 text-sm">
          <span>
            <span className="text-muted">出発地</span> {plan.origin}
          </span>
          <span>
            <span className="text-muted">走行距離</span> {plan.totalKmApprox}
          </span>
          <span>
            <span className="text-muted">おすすめ時期</span> {plan.season}
          </span>
          <span>
            <span className="text-muted">巡るコース</span>{" "}
            {plan.courseSlugs.length}本
          </span>
        </div>
      </section>

      {/* タイムライン */}
      <section className="mx-auto max-w-3xl px-5 pt-16 md:px-8 md:pt-24">
        <SectionHeading label="Timeline" title="1日のスケジュール" />
        <p className="mt-3 text-xs text-muted">
          時刻はすべて目安です。交通状況・季節によって大きく変わります。
        </p>
        <ol className="mt-10 space-y-0">
          {plan.schedule.map((stop, i) => {
            const course = stop.courseSlug
              ? getCourseBySlug(stop.courseSlug)
              : undefined;
            return (
              <li key={i} className="relative flex gap-6 pb-10 last:pb-0">
                {/* 縦ライン */}
                {i < plan.schedule.length - 1 && (
                  <span
                    className="absolute left-[3.35rem] top-7 h-full w-px bg-line"
                    aria-hidden
                  />
                )}
                <span className="w-16 shrink-0 pt-0.5 text-right font-mono text-sm text-muted">
                  {stop.time}
                </span>
                <span
                  className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border border-black/30 bg-surface"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">
                    {course ? (
                      <Link
                        href={`/courses/${course.slug}`}
                        className="underline decoration-line underline-offset-4 transition-colors hover:text-signal"
                      >
                        {stop.title}
                      </Link>
                    ) : (
                      stop.title
                    )}
                  </p>
                  {stop.note && (
                    <p className="prose-jp mt-1.5 text-sm text-muted">
                      {stop.note}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* このプランで走るコース */}
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHeading label="Courses" title="このプランで走る道" />
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Reveal key={course.slug}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* アドバイス */}
      <section className="mx-auto max-w-3xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHeading label="Tips" title="このプランのコツ" />
        <ul className="mt-8 space-y-4">
          {plan.tips.map((tip) => (
            <li
              key={tip}
              className="prose-jp border-b border-line pb-4 text-sm text-text/85"
            >
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <Link
          href="/plans"
          className="inline-block border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          ← 他のプランを見る
        </Link>
      </div>
    </article>
  );
}
