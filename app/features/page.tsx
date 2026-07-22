import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import { features, getVideoForFeature } from "@/data/features";
import { getCourseBySlug } from "@/lib/courses";

export const metadata: Metadata = {
  title: "絶景ロード特集",
  description:
    "YouTube「Holiday Ideas」の絶景ドライブ特集を記事で。紹介コースの位置を1枚の地図で俯瞰しながら、気になる道の詳細データへ飛べます。",
};

export default function FeaturesPage() {
  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Features</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          絶景ロード特集
        </h1>
        <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
          YouTubeで公開している絶景ドライブ特集の「記事版」です。動画の魅力を文章と写真でじっくり味わいながら、紹介コースの位置を地図で俯瞰し、気になる道の詳細データへ飛べます。
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-5 md:grid-cols-2 md:px-8">
        {features.map((feature) => {
          const video = getVideoForFeature(feature);
          const heroSlug = feature.highlights[0]?.courseSlug;
          const hero = heroSlug ? getCourseBySlug(heroSlug) : undefined;
          const courseCount =
            video?.chapters.filter((ch) => ch.courseSlug).length ?? 0;
          return (
            <Reveal key={feature.slug}>
              <Link
                href={`/features/${feature.slug}`}
                className="group block border border-line transition-colors hover:border-black/40"
              >
                {hero && (
                  <div className="img-hover relative aspect-[16/9]">
                    <SmartImage
                      src={hero.heroImage}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-lg font-medium leading-snug">
                    {feature.title}
                  </p>
                  <p className="prose-jp mt-2 line-clamp-2 text-xs text-muted">
                    {feature.subtitle}
                  </p>
                  <p className="mt-4 font-mono text-xs text-muted">
                    {courseCount} COURSES / MAP / VIDEO
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
