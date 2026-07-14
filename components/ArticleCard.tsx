import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { CATEGORY_LABELS, type Article } from "@/types/article";

type Props = {
  article: Article;
  large?: boolean;
};

export default function ArticleCard({ article, large = false }: Props) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group block"
    >
      <div className={`img-hover relative ${large ? "aspect-[16/9]" : "aspect-[3/2]"}`}>
        <SmartImage
          src={article.heroImage}
          alt={article.title}
          fill
          sizes={large ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="border border-line px-2 py-0.5 text-[10px] tracking-wider text-muted">
          {CATEGORY_LABELS[article.category]}
        </span>
        {article.youtubeId && (
          <span className="flex items-center gap-1 text-[10px] tracking-wider text-muted">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden
              className="fill-current"
            >
              <polygon points="2,1 9,5 2,9" />
            </svg>
            動画あり
          </span>
        )}
      </div>
      <h3
        className={`mt-3 font-medium leading-snug ${
          large ? "text-xl md:text-2xl" : "text-base"
        }`}
      >
        {article.title}
      </h3>
      <p className="prose-jp mt-2 line-clamp-2 text-xs text-muted">
        {article.excerpt}
      </p>
      <p className="mt-3 font-mono text-[10px] text-muted">
        {article.publishedAt}
      </p>
    </Link>
  );
}
