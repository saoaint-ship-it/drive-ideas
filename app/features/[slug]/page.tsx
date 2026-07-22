import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import CourseCard from "@/components/CourseCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import FeatureMap from "@/components/FeatureMap";
import {
  features,
  getFeatureBySlug,
  getVideoForFeature,
} from "@/data/features";
import { getCourseBySlug } from "@/lib/courses";
import { formatVideoTime } from "@/data/videos";
import { site } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return {};
  return {
    title: feature.title,
    description: feature.description,
    alternates: { canonical: `/features/${feature.slug}` },
    openGraph: { title: feature.title, description: feature.description },
  };
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) notFound();

  const video = getVideoForFeature(feature);
  if (!video) notFound();

  // チャプターからコースを引く(サイト未掲載チャプターは除外)
  const chapterCourses = video.chapters
    .filter((ch) => ch.courseSlug)
    .map((ch) => ({
      chapter: ch,
      course: getCourseBySlug(ch.courseSlug!),
    }))
    .filter((x) => x.course);

  const mapItems = chapterCourses.map(({ course }) => ({
    slug: course!.slug,
    name: course!.name,
    lat: course!.center.lat,
    lng: course!.center.lng,
    path: course!.path,
  }));

  const heroCourse = getCourseBySlug(
    feature.highlights[0]?.courseSlug ?? chapterCourses[0]!.course!.slug
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: feature.title,
    description: feature.description,
    itemListElement: chapterCourses.map(({ course }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: course!.name,
      url: `${site.url}/courses/${course!.slug}`,
    })),
  };

  return (
    <article className="pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヒーロー */}
      <section className="relative h-[60vh] w-full">
        {heroCourse && (
          <SmartImage
            src={heroCourse.heroImage}
            alt={feature.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
          <p className="label-en">Feature</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-medium leading-tight md:text-5xl">
            {feature.title}
          </h1>
          <p className="mt-4 text-base text-text/80 md:text-lg">
            {feature.subtitle}
          </p>
        </div>
      </section>

      {/* 導入 */}
      <section className="mx-auto max-w-3xl px-5 pt-16 md:px-8 md:pt-24">
        {feature.intro.map((para) => (
          <p
            key={para.slice(0, 20)}
            className="prose-jp mt-6 text-base text-text/85 first:mt-0 md:text-lg"
          >
            {para}
          </p>
        ))}
      </section>

      {/* 紹介コースの位置を1枚の地図で */}
      <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8 md:pt-28">
        <SectionHeading
          label="Overview Map"
          title="この特集で巡る道を、1枚の地図で。"
        />
        <p className="mt-3 text-xs text-muted">
          光っている点が紹介コースです。クリックすると、そのコースの詳細ページへ移動します。
        </p>
        <div className="mt-8 h-[420px] w-full md:h-[560px]">
          <FeatureMap items={mapItems} />
        </div>
      </section>

      {/* 代表コースの深掘り */}
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHeading label="Highlights" title="この特集の見どころ" />
        <div className="mt-10 space-y-16">
          {feature.highlights.map((h, i) => {
            const course = getCourseBySlug(h.courseSlug);
            if (!course) return null;
            return (
              <Reveal key={h.courseSlug}>
                <Link
                  href={`/courses/${course.slug}`}
                  className={`group grid items-center gap-8 md:grid-cols-2 ${
                    i % 2 === 1 ? "md:[direction:rtl]" : ""
                  }`}
                >
                  <div className="img-hover relative aspect-[16/10] [direction:ltr]">
                    <SmartImage
                      src={course.heroImage}
                      alt={course.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="[direction:ltr]">
                    <p className="label-en">{course.prefectures.join(" / ")}</p>
                    <h3 className="mt-2 text-2xl font-medium transition-colors group-hover:text-signal">
                      {course.name}
                    </h3>
                    <p className="prose-jp mt-4 text-sm text-text/85">
                      {h.text}
                    </p>
                    <span className="mt-5 inline-block text-sm text-muted transition-colors group-hover:text-text">
                      コースの詳細データを見る →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 動画本体 */}
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHeading label="Video" title="映像で走る" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <YouTubeEmbed youtubeId={video.id} title={video.title} />
            <a
              href={`https://youtu.be/${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-muted transition-colors hover:text-text"
            >
              YouTubeで見る →
            </a>
          </div>
          <div>
            <p className="label-en">Chapters</p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {video.chapters.map((ch) => (
                <li key={ch.timeSec} className="flex items-center gap-4 py-2.5">
                  <a
                    href={`https://youtu.be/${video.id}?t=${ch.timeSec}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 shrink-0 font-mono text-xs text-muted transition-colors hover:text-text"
                  >
                    {formatVideoTime(ch.timeSec)}
                  </a>
                  {ch.courseSlug ? (
                    <Link
                      href={`/courses/${ch.courseSlug}`}
                      className="text-sm transition-colors hover:text-signal"
                    >
                      {ch.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted">{ch.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 全コース一覧 */}
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHeading
          label="All Courses"
          title={`この特集の全${chapterCourses.length}コース`}
        />
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {chapterCourses.map(({ course }) => (
            <Reveal key={course!.slug}>
              <CourseCard course={course!} />
            </Reveal>
          ))}
        </div>
        <p className="prose-jp mt-12 max-w-2xl text-sm text-muted">
          {feature.outro}
        </p>
      </section>

      <div className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <Link
          href="/features"
          className="inline-block border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          ← 他の特集を見る
        </Link>
      </div>
    </article>
  );
}
