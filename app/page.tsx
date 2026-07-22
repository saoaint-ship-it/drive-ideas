import Link from "next/link";
import Image from "next/image";
import SmartImage from "@/components/SmartImage";
import CourseCard from "@/components/CourseCard";
import ArticleCard from "@/components/ArticleCard";
import WeekendPlanner from "@/components/WeekendPlanner";
import JapanSilhouette from "@/components/JapanSilhouette";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import {
  getFeaturedCourses,
  getCoursesByMonth,
  getCourseBySlug,
} from "@/lib/courses";
import { collections } from "@/data/collections";
import { plans } from "@/data/plans";
import { getAllArticles } from "@/lib/articles";
import { videos } from "@/data/videos";
import { CATEGORY_LABELS, type ArticleCategory } from "@/types/article";
import { site } from "@/config/site";

const REGIONS: { name: string; count: number }[] = [
  { name: "北海道", count: 18 },
  { name: "東北", count: 16 },
  { name: "関東", count: 11 },
  { name: "中部", count: 18 },
  { name: "近畿", count: 12 },
  { name: "中国", count: 5 },
  { name: "四国", count: 4 },
  { name: "九州・沖縄", count: 14 },
];

export default function Home() {
  const featured = getFeaturedCourses(6);
  const month = new Date().getMonth() + 1;
  const seasonal = getCoursesByMonth(month).slice(0, 4);
  const homeVideos = videos.slice(0, 4);
  const articles = getAllArticles();
  const rankingArticle =
    articles.find((a) => a.category === "ranking") ?? articles[0];
  const otherArticles = articles
    .filter((a) => a.slug !== rankingArticle.slug)
    .slice(0, 4);
  const categoryCounts = (
    Object.keys(CATEGORY_LABELS) as ArticleCategory[]
  ).map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    count: articles.filter((a) => a.category === key).length,
  }));

  // SEO: サイト全体の構造化データ（ブランド情報を検索エンジンに伝える）
  const siteJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/images/logo.jpg`,
      sameAs: [site.sns.x, site.sns.youtube],
    },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />

      {/* 1. ヒーロー: 全画面。実写ループ動画 + 静止画フォールバック */}
      <section className="relative h-screen w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero.mp4"
          poster="/images/courses/niraikanai.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.jpg"
              alt=""
              width={56}
              height={56}
              className="rounded-full"
            />
            <p className="label-en">The Road Discovery Journal</p>
          </div>
          <h1 className="font-display mt-6 text-6xl font-light leading-none tracking-tight md:text-8xl">
            DRIVE IDEAS
          </h1>
          <p className="mt-6 text-lg text-text/80 md:text-xl">{site.tagline}</p>
        </div>
      </section>

      {/* 2. 週末プランナー入口 */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-40">
        <Reveal>
          <SectionHeading
            label="Weekend Planner"
            title="出発地を選ぶだけ。"
          />
          <p className="prose-jp mt-4 max-w-xl text-sm text-muted">
            今週末に走れる道を、出発地からの所要時間で探せます。
          </p>
          <div className="mt-8 max-w-2xl">
            <WeekendPlanner />
          </div>
        </Reveal>
      </section>

      {/* 3. FEATURED COURSES */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-40">
        <Reveal>
          <div className="flex items-end justify-between">
            <SectionHeading label="Featured Courses" title="今、走りたい道。" />
            <Link
              href="/courses"
              className="hidden shrink-0 text-sm text-muted transition-colors hover:text-text md:block"
            >
              すべてのコース →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {featured.map((course) => (
            <Reveal key={course.slug}>
              <CourseCard course={course} large />
            </Reveal>
          ))}
        </div>
        <Link
          href="/courses"
          className="mt-10 block text-sm text-muted md:hidden"
        >
          すべてのコース →
        </Link>
      </section>

      {/* 3.5 地方から探す */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading label="Regions" title="地方から探す" />
            <p className="prose-jp mt-4 max-w-xl text-sm text-muted">
              全国{REGIONS.reduce((s, r) => s + r.count, 0)}コースを8つの地方から。走りたいエリアを選んで、そこから道を探せます。
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REGIONS.map((r) => (
              <Reveal key={r.name}>
                <Link
                  href={`/courses?region=${encodeURIComponent(r.name)}`}
                  className="group flex items-center justify-between border border-line px-6 py-6 transition-colors hover:border-black/40"
                >
                  <span className="text-lg font-medium">{r.name}</span>
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-text">
                    {r.count} COURSES →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* テーマから探すチップ */}
          <Reveal>
            <div className="mt-10 flex flex-wrap items-center gap-2.5">
              {collections.map((col) => (
                <Link
                  key={col.slug}
                  href={`/collections/${col.slug}`}
                  className="border border-line px-4 py-2 text-xs transition-colors hover:border-black/40"
                >
                  {col.label}
                </Link>
              ))}
              <Link
                href="/pref"
                className="border border-line px-4 py-2 text-xs transition-colors hover:border-black/40"
              >
                都道府県から探す →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3.7 日帰りモデルプラン */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-40">
        <Reveal>
          <div className="flex items-end justify-between">
            <SectionHeading
              label="Model Plans"
              title="そのまま走れる、日帰りプラン。"
            />
            <Link
              href="/plans"
              className="hidden shrink-0 text-sm text-muted transition-colors hover:text-text md:block"
            >
              すべてのプラン →
            </Link>
          </div>
          <p className="prose-jp mt-4 max-w-xl text-sm text-muted">
            出発時刻から立ち寄りまで組んだ1日の設計図。迷ったらこのまま走ってください。
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {plans.slice(0, 3).map((plan) => {
            const hero = getCourseBySlug(plan.courseSlugs[0]);
            return (
              <Reveal key={plan.slug}>
                <Link href={`/plans/${plan.slug}`} className="group block">
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
                  <p className="label-en mt-4">{plan.origin}発</p>
                  <p className="mt-1.5 font-medium leading-snug">{plan.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">
                    {plan.catchcopy}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <Link
          href="/plans"
          className="mt-10 block text-sm text-muted md:hidden"
        >
          すべてのプラン →
        </Link>
      </section>

      {/* 4. 全国マップへの導線: 空撮動画と同じ「夜の日本」に沈む全幅ダークセクション */}
      <section className="bg-[#0a1626] bg-[radial-gradient(ellipse_80%_90%_at_70%_45%,#13294a_0%,#0a1626_55%,#070f1c_100%)]">
        <Link
          href="/map"
          className="group mx-auto grid max-w-7xl items-center gap-10 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32"
        >
          <Reveal>
            <p className="label-en !text-sky-200/50">Map</p>
            <h2 className="mt-3 text-2xl font-medium leading-snug text-white md:text-3xl">
              全国のドライブコースを
              <br className="hidden md:block" />
              地図から探す
            </h2>
            <p className="prose-jp mt-4 max-w-md text-sm text-sky-100/55">
              北海道から九州まで、{`98`}
              本の絶景ロードが夜の日本列島に灯る。行き先が決まっていない日は、地図を眺めるところから。
            </p>
            <span className="mt-8 inline-block border border-white/25 px-6 py-3 text-sm text-white transition-colors group-hover:border-white/70">
              マップを開く →
            </span>
          </Reveal>
          <Reveal className="mx-auto w-full max-w-md">
            <JapanSilhouette />
          </Reveal>
        </Link>
      </section>

      {/* 5. VIDEOS: 動画で巡る絶景ドライブ */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-40">
        <Reveal>
          <div className="flex items-end justify-between">
            <SectionHeading label="Videos" title="動画で巡る絶景ドライブ" />
            <Link
              href="/videos"
              className="hidden shrink-0 text-sm text-muted transition-colors hover:text-text md:block"
            >
              動画一覧を見る →
            </Link>
          </div>
          <p className="prose-jp mt-4 max-w-xl text-sm text-muted">
            YouTube「Holiday Ideas」の絶景まとめ動画。気になった道は、そのままコースの詳細ページで通行規制や立ち寄りスポットまで確認できます。
            じっくり読みたい人には、紹介コースを1枚の地図で俯瞰できる
            <Link
              href="/features"
              className="underline decoration-line underline-offset-4 transition-colors hover:text-text"
            >
              特集記事版
            </Link>
            も。
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {homeVideos.map((video) => (
            <Reveal key={video.id}>
              <YouTubeEmbed youtubeId={video.id} title={video.title} />
              <p className="mt-4 text-sm font-medium">{video.title}</p>
            </Reveal>
          ))}
        </div>
        <Link
          href="/videos"
          className="mt-10 block text-sm text-muted md:hidden"
        >
          動画一覧を見る →
        </Link>
      </section>

      {/* 6. SEASON: 今月の見頃 */}
      {seasonal.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-40">
          <Reveal>
            <SectionHeading
              label="Season"
              title={`${month}月が見頃の道。`}
            />
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {seasonal.map((course) => (
              <Reveal key={course.slug}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 6. JOURNAL: ランキング記事を大きめに + 新着4本 */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between">
            <SectionHeading label="Journal" title="読んでから、走る。" />
            <Link
              href="/journal"
              className="hidden shrink-0 text-sm text-muted transition-colors hover:text-text md:block"
            >
              すべての記事 →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
          <Reveal>
            <ArticleCard article={rankingArticle} large />
          </Reveal>
          <div className="grid gap-y-14 sm:grid-cols-2 md:content-start">
            {otherArticles.map((a) => (
              <Reveal key={a.slug}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </div>
        <Link
          href="/journal"
          className="mt-10 block text-sm text-muted md:hidden"
        >
          すべての記事 →
        </Link>
      </section>

      {/* 7. JOURNAL カテゴリ入口: テーマから記事を探す */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading label="Topics" title="テーマから記事を探す" />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCounts.map((c) => (
              <Reveal key={c.key}>
                <Link
                  href={`/journal?cat=${c.key}`}
                  className="group block border border-line px-6 py-8 transition-colors hover:border-black/40"
                >
                  <p className="font-mono text-xs text-muted">
                    {c.count} ARTICLES
                  </p>
                  <p className="mt-3 text-lg font-medium">{c.label}</p>
                  <p className="mt-4 text-sm text-muted transition-colors group-hover:text-text">
                    記事一覧へ →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
