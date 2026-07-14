import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import RankingTable from "@/components/RankingTable";
import Markdown from "@/components/Markdown";
import CourseCard from "@/components/CourseCard";
import ArticleCard from "@/components/ArticleCard";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  getAdjacentArticles,
  extractHeadings,
} from "@/lib/articles";
import { getCoursesBySlugs } from "@/lib/courses";
import { CATEGORY_LABELS } from "@/types/article";
import { site } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.body);
  const relatedCourses = article.relatedCourseSlugs
    ? getCoursesBySlugs(article.relatedCourseSlugs)
    : [];
  const relatedArticles = getRelatedArticles(article, 4);
  const { prev, next } = getAdjacentArticles(article.slug);

  // SEO: Article の JSON-LD。ランキング記事には ItemList も併記する
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      image: `${site.url}${article.heroImage}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { "@type": "Organization", name: site.name },
      publisher: { "@type": "Organization", name: site.name },
    },
  ];
  if (article.rankingTable) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: article.title,
      itemListElement: article.rankingTable.rows.map((row, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: String(row[1]),
      })),
    });
  }

  return (
    <article className="pb-32 pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヒーロー（機能モード寄り: 高さ控えめ） */}
      <div className="relative h-[40vh] min-h-[280px] w-full md:h-[50vh]">
        <SmartImage
          src={article.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/30" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex gap-12">
          {/* 本文カラム */}
          <div className="min-w-0 max-w-3xl flex-1">
            <header className="-mt-20 relative">
              <div className="flex items-center gap-3">
                <span className="border border-line bg-ink px-2.5 py-1 text-[11px] tracking-wider text-muted">
                  {CATEGORY_LABELS[article.category]}
                </span>
              </div>
              <h1 className="mt-5 text-2xl font-medium leading-snug md:text-4xl md:leading-snug">
                {article.title}
              </h1>
              <p className="mt-4 font-mono text-xs text-muted">
                {article.publishedAt} 公開
                {article.updatedAt !== article.publishedAt &&
                  ` / ${article.updatedAt} 更新`}
              </p>
            </header>

            <p className="prose-jp mt-8 border-l-2 border-line pl-5 text-sm text-text/75 md:text-base">
              {article.excerpt}
            </p>

            {/* 実走動画は記事の「冒頭〜前半」に置く（このサイトの最大の強み） */}
            {article.youtubeId && (
              <div className="mt-10">
                <p className="label-en mb-3">Test Drive Video</p>
                <YouTubeEmbed youtubeId={article.youtubeId} title={article.title} />
              </div>
            )}

            {/* ランキング表（ソート可能） */}
            {article.rankingTable && (
              <div className="mt-10">
                <p className="label-en mb-3">Ranking</p>
                <RankingTable data={article.rankingTable} />
                <p className="mt-2 text-[11px] text-muted">
                  列見出しをクリックすると並べ替えできます
                </p>
              </div>
            )}

            <div className="mt-6">
              <Markdown body={article.body} />
            </div>

            {/* 記事 → コース → 走りに行く、という導線 */}
            {relatedCourses.length > 0 && (
              <div className="mt-20">
                <SectionHeading
                  label="Drive Courses"
                  title="この記事に出てきた道"
                />
                <div className="mt-8 grid gap-10 sm:grid-cols-2">
                  {relatedCourses.map((c) => (
                    <CourseCard key={c.slug} course={c} />
                  ))}
                </div>
              </div>
            )}

            {/* 記事 → 記事の回遊導線 */}
            {relatedArticles.length > 0 && (
              <div className="mt-20">
                <SectionHeading label="Related" title="あわせて読みたい" />
                <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
                  {relatedArticles.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              </div>
            )}

            {/* 前後の記事 */}
            {(prev || next) && (
              <nav
                aria-label="前後の記事"
                className="mt-20 grid border-y border-line sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/journal/${prev.slug}`}
                    className="group px-1 py-6 sm:border-r sm:border-line sm:pr-8"
                  >
                    <p className="label-en">← Older</p>
                    <p className="mt-2 text-sm leading-snug transition-colors group-hover:text-signal">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {next && (
                  <Link
                    href={`/journal/${next.slug}`}
                    className="group px-1 py-6 text-right sm:pl-8"
                  >
                    <p className="label-en">Newer →</p>
                    <p className="mt-2 text-sm leading-snug transition-colors group-hover:text-signal">
                      {next.title}
                    </p>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* 目次（デスクトップのみ・追従） */}
          {headings.length > 0 && (
            <nav
              aria-label="目次"
              className="hidden w-56 shrink-0 lg:block"
            >
              <div className="sticky top-24 border-l border-line pl-5">
                <p className="label-en">Index</p>
                <ul className="mt-4 space-y-3">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="block text-xs leading-relaxed text-muted transition-colors hover:text-text"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}
