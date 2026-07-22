import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import SpecMeter from "@/components/SpecMeter";
import CourseMap from "@/components/map/CourseMap";
import ElevationProfile from "@/components/ElevationProfile";
import CourseCard from "@/components/CourseCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getAllCourses, getCourseBySlug, getRelatedCourses } from "@/lib/courses";
import { publicFileExists } from "@/lib/files";
import { site } from "@/config/site";
import AffiliateBox from "@/components/AffiliateBox";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { isAffiliateActive } from "@/config/affiliates";
import { getVideoAppearancesForCourse, formatVideoTime } from "@/data/videos";
import { roadStats } from "@/data/roadStats";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  const title = `${course.name}（${course.prefectures.join("・")}）`;
  return {
    title,
    description: course.summary,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      type: "article",
      title,
      description: course.summary,
      url: `/courses/${course.slug}`,
      images: [course.heroImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: course.summary,
      images: [course.heroImage],
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const related = getRelatedCourses(course, 3);
  const videoAppearances = getVideoAppearancesForCourse(course.slug);
  const stats = roadStats[course.slug];

  // 写真が実際に置かれている枠だけを表示する（未設置の枠はセクションごと隠す）
  const galleryImages = course.gallery.filter(publicFileExists);
  const spotPhotos = course.spots.map((_, i) => {
    const p = `/images/courses/${course.slug}/spot-${i + 1}.jpg`;
    return publicFileExists(p) ? p : null;
  });

  // SEO: このコースの構造化データ。観光スポット + パンくず
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: course.name,
      description: course.summary,
      image: `${site.url}${course.heroImage}`,
      address: {
        "@type": "PostalAddress",
        addressRegion: course.prefectures.join("・"),
        addressCountry: "JP",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: course.center.lat,
        longitude: course.center.lng,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "コースを探す",
          item: `${site.url}/courses`,
        },
        { "@type": "ListItem", position: 3, name: course.name },
      ],
    },
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. ヒーロー */}
      <section className="relative h-screen w-full">
        <SmartImage
          src={course.heroImage}
          alt={course.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
          <p className="label-en">
            {course.region} / {course.prefectures.join(" / ")}
          </p>
          <h1 className="mt-4 text-4xl font-medium leading-tight md:text-6xl">
            {course.name}
          </h1>
          <p className="mt-5 text-lg text-text/75 md:text-xl">
            {course.catchcopy}
          </p>
        </div>
      </section>

      {/* 2. スペックメーター */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="py-10 md:py-14">
          <SpecMeter course={course} />
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
            <span>
              最高標高{" "}
              <span className="font-mono">{course.maxElevationM.toLocaleString()}m</span>
            </span>
            <span>難易度 {course.difficulty}</span>
            <span>
              {course.toll}
              {course.tollNote ? `（${course.tollNote}）` : ""}
            </span>
            <span>ベストシーズン {course.bestSeasons.join("・")}</span>
            {course.narrowRoadWarning && <span>車幅注意</span>}
          </div>
          {stats && (
            <div className="mt-3 border-t border-line pt-3">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                <span>
                  カーブ{" "}
                  <span className="font-mono text-text/80">{stats.corners}</span>
                  箇所
                </span>
                <span>
                  うちヘアピン{" "}
                  <span className="font-mono text-text/80">{stats.hairpins}</span>
                  箇所
                </span>
                {stats.maxGradientPct !== null && (
                  <span>
                    最大勾配{" "}
                    <span className="font-mono text-text/80">
                      約{stats.maxGradientPct}%
                    </span>
                  </span>
                )}
                <span className="text-muted/70">
                  ※ルート形状・標高データからの自動計算値（目安）
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2.5 動画導線: この道が登場するYouTube動画（あれば表示） */}
      {videoAppearances.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="border border-line px-6 py-6 md:px-8">
            <p className="label-en">Featured In Video</p>
            <div className="mt-4 space-y-4">
              {videoAppearances.map(({ video, chapter }) => (
                <a
                  key={`${video.id}-${chapter.timeSec}`}
                  href={`https://youtu.be/${video.id}?t=${chapter.timeSec}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4"
                >
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium transition-colors group-hover:text-signal">
                      {video.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatVideoTime(chapter.timeSec)}〜 この場面から再生 →
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. 通行規制アラート */}
      {course.closure && (
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="border border-signal/60 px-6 py-5">
            <p className="flex items-center gap-3 text-sm text-signal">
              <span className="inline-block h-1.5 w-1.5 bg-signal" aria-hidden />
              <span className="font-medium">{course.closure.type}</span>
            </p>
            <p className="mt-2 text-sm text-text/75">{course.closure.period}</p>
            {course.closure.openingDateNote && (
              <p className="mt-1 text-xs text-muted">
                {course.closure.openingDateNote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 4. 概要文 */}
      <Reveal as="section" className="mx-auto max-w-3xl px-5 py-24 md:px-8 md:py-40">
        <p className="prose-jp text-base md:text-lg">{course.summary}</p>
      </Reveal>

      {/* 4.5 ギャラリー: 沿道の風景（写真が設置されている場合のみ表示） */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-40">
          <SectionHeading label="Gallery" title="沿道の風景" />
          <div
            className={`mt-8 grid gap-5 ${
              galleryImages.length > 1 ? "md:grid-cols-2" : ""
            }`}
          >
            {galleryImages.map((src, i) => (
              <Reveal key={src} className="img-hover relative">
                <div
                  className={`relative ${
                    galleryImages.length === 1 ? "aspect-[21/9]" : "aspect-[4/3]"
                  }`}
                >
                  <SmartImage
                    src={src}
                    alt={`${course.name}の風景 ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 5. 地図 */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading label="Route Map" title="ルート" />
        <div className="mt-8 h-[420px] w-full md:h-[520px]">
          <CourseMap
            center={course.center}
            path={course.path}
            markers={course.spots}
            spotImages={spotPhotos}
            fitToPath
            slug={course.slug}
          />
        </div>
      </section>

      {/* 6. 標高プロファイル */}
      <Reveal as="section" className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <SectionHeading label="Elevation" title="標高プロファイル" />
        <div className="mt-8">
          <ElevationProfile
            profile={course.elevationProfile}
            distanceKm={course.distanceKm}
          />
        </div>
      </Reveal>

      {/* 8. 立ち寄りスポット */}
      <section className="pt-24 md:pt-40">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading label="Spots" title="立ち寄りスポット" />
        </div>
        <div className="mt-8 overflow-x-auto pb-4">
          <ul className="mx-auto flex max-w-7xl gap-4 px-5 md:px-8">
            {course.spots.map((spot, i) => (
              <li
                key={spot.name}
                className="w-64 shrink-0 border border-line bg-surface"
              >
                {/* スポット写真(/images/courses/(コース名)/spot-連番.jpg)が
                    設置されている場合のみ画像を表示する */}
                {spotPhotos[i] && (
                  <div className="relative aspect-[3/2]">
                    <SmartImage
                      src={spotPhotos[i]}
                      alt={spot.name}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <p className="label-en">{spot.type}</p>
                  <p className="mt-2 font-medium">{spot.name}</p>
                  {spot.note && (
                    <p className="prose-jp mt-2 text-xs text-muted">{spot.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. 本文 */}
      <section className="mx-auto max-w-3xl px-5 pt-24 md:px-8 md:pt-40">
        {course.body.map((block) => (
          <Reveal key={block.heading} className="mt-16 first:mt-0">
            <h2 className="text-xl font-medium md:text-2xl">{block.heading}</h2>
            <p className="prose-jp mt-5 text-sm text-text/85 md:text-base">
              {block.text}
            </p>
          </Reveal>
        ))}
      </section>

      {/* 10. 安全・注意点 */}
      <section className="mx-auto max-w-3xl px-5 pt-24 md:px-8 md:pt-40">
        <SectionHeading label="Cautions" title="安全・注意点" />
        <ul className="mt-8 space-y-4">
          {course.cautions.map((caution) => (
            <li
              key={caution}
              className="prose-jp border-b border-line pb-4 text-sm text-text/85"
            >
              {caution}
            </li>
          ))}
        </ul>
      </section>

      {/* 10.5 旅の準備（宿・レンタカー）。広告リンク未設定なら表示されない */}
      {(isAffiliateActive("hotel") || isAffiliateActive("rentalcar")) && (
        <section className="mx-auto max-w-3xl px-5 pt-24 md:px-8 md:pt-40">
          <SectionHeading label="Plan Your Trip" title="このドライブを旅にする" />
          <div className="mt-4">
            <AffiliateDisclosure />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <AffiliateBox
              id="hotel"
              title={`${course.prefectures[0]}周辺の宿を探す`}
            />
            <AffiliateBox id="rentalcar" />
          </div>
        </section>
      )}

      {/* 11. 関連コース */}
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-40">
        <SectionHeading label="Related" title={`${course.region}の他のコース`} />
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {related.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>

      {/* 12. 最終更新日 */}
      <p className="mx-auto max-w-7xl px-5 py-24 font-mono text-xs text-muted md:px-8 md:py-32">
        LAST UPDATE {course.updatedAt}
      </p>
    </article>
  );
}
