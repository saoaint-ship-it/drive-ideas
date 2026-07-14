import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article, ArticleCategory, ArticleHeading } from "@/types/article";

// 記事は content/journal/*.md の frontmatter で管理する。
// ページからは必ずこの関数経由でアクセスする(将来CMS差し替え時はここだけ変更)

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

function parseArticle(filename: string): Article {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(JOURNAL_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    category: data.category as ArticleCategory,
    excerpt: data.excerpt,
    heroImage: data.heroImage,
    photoQuery: data.photoQuery,
    youtubeId: data.youtubeId,
    relatedCourseSlugs: data.relatedCourseSlugs,
    relatedArticleSlugs: data.relatedArticleSlugs,
    publishedAt: String(data.publishedAt),
    updatedAt: String(data.updatedAt),
    rankingTable: data.rankingTable,
    body: content,
  };
}

export function getAllArticles(): Article[] {
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseArticle)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | undefined {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(JOURNAL_DIR, file))) return undefined;
  return parseArticle(file);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

// 関連記事: 明示指定(relatedArticleSlugs)を優先し、足りない分は同カテゴリの新着で埋める
export function getRelatedArticles(article: Article, count = 4): Article[] {
  const all = getAllArticles().filter((a) => a.slug !== article.slug);
  const bySlug = new Map(all.map((a) => [a.slug, a]));

  const picked: Article[] = [];
  for (const slug of article.relatedArticleSlugs ?? []) {
    const a = bySlug.get(slug);
    if (a && !picked.some((p) => p.slug === a.slug)) picked.push(a);
    if (picked.length >= count) return picked;
  }
  for (const a of all) {
    if (a.category !== article.category) continue;
    if (picked.some((p) => p.slug === a.slug)) continue;
    picked.push(a);
    if (picked.length >= count) return picked;
  }
  return picked;
}

// 前後の記事（公開日順）: 記事末尾の「次に読む」導線用
export function getAdjacentArticles(slug: string): {
  prev?: Article;
  next?: Article;
} {
  const all = getAllArticles();
  const i = all.findIndex((a) => a.slug === slug);
  if (i === -1) return {};
  return { prev: all[i + 1], next: all[i - 1] };
}

// 目次用: 本文Markdownから h2 を抜き出す
export function extractHeadings(body: string): ArticleHeading[] {
  return body
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line, i) => ({
      id: `section-${i + 1}`,
      text: line.replace(/^## /, "").trim(),
    }));
}
