import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-32 text-center md:px-8">
      <p className="label-en">404</p>
      <h1 className="font-display mt-4 text-3xl font-light tracking-tight md:text-5xl">
        ページが見つかりません
      </h1>
      <p className="prose-jp mx-auto mt-6 max-w-md text-sm text-muted">
        お探しのページは移動または削除された可能性があります。
        下のリンクから、走りたい道を探しに行きましょう。
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          トップへ戻る →
        </Link>
        <Link
          href="/courses"
          className="border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          コースを探す →
        </Link>
      </div>
    </div>
  );
}
