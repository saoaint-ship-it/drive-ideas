export type ArticleCategory = "ranking" | "rules" | "practical" | "news";

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  ranking: "ランキング・比較",
  rules: "車のルール・手続き",
  practical: "ドライブ実用",
  news: "ニュース",
};

export type RankingTable = {
  headers: string[];
  rows: (string | number)[][];
};

export type Article = {
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  heroImage: string;
  photoQuery?: string; // 素材サイトで写真を探すときの検索キーワード
  youtubeId?: string;
  relatedCourseSlugs?: string[];
  relatedArticleSlugs?: string[]; // 記事間の回遊用。明示指定した関連記事
  publishedAt: string;
  updatedAt: string;
  body: string; // Markdown
  rankingTable?: RankingTable;
};

export type ArticleHeading = {
  id: string;
  text: string;
};
