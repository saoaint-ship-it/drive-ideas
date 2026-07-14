import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";
import { CATEGORY_LABELS, type ArticleCategory } from "@/types/article";

export const metadata: Metadata = {
  title: "ジャーナル",
  description:
    "車とドライブの実用情報。ランキング・車のルール・ドライブ実用テク・道路ニュース。",
};

type Props = {
  searchParams: Promise<{ cat?: string }>;
};

const TABS: { key: string; label: string }[] = [
  { key: "", label: "すべて" },
  ...(
    Object.entries(CATEGORY_LABELS) as [ArticleCategory, string][]
  ).map(([key, label]) => ({ key, label })),
];

export default async function JournalPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const all = getAllArticles();
  const articles = cat
    ? all.filter((a) => a.category === cat)
    : all;

  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">Journal</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">ジャーナル</h1>
        <p className="prose-jp mt-4 max-w-xl text-sm text-muted">
          車とドライブの実用情報。カタログではなく、実際に走って確かめた情報をお届けします。
        </p>

        {/* カテゴリタブ */}
        <nav aria-label="カテゴリ" className="mt-10 border-b border-line">
          <ul className="flex flex-wrap gap-x-8">
            {TABS.map((tab) => {
              const active = (cat ?? "") === tab.key;
              return (
                <li key={tab.key}>
                  <Link
                    href={tab.key ? `/journal?cat=${tab.key}` : "/journal"}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b-2 pb-3 text-sm transition-colors ${
                      active
                        ? "border-signal text-text"
                        : "border-transparent text-muted hover:text-text"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-6 font-mono text-xs text-muted">
          {articles.length} ARTICLES
        </p>

        {articles.length > 0 ? (
          <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-line px-6 py-16 text-center">
            <p className="text-sm">このカテゴリの記事はまだありません。</p>
            <Link
              href="/journal"
              className="mt-4 inline-block text-sm text-muted underline hover:text-text"
            >
              すべての記事を見る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
