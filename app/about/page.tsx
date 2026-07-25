import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: site.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-32 md:px-8">
      <Image
        src="/images/logo.jpg"
        alt={`${site.name}のロゴ`}
        width={96}
        height={96}
        className="rounded-full"
      />

      <h1 className="font-display mt-10 text-3xl font-light tracking-tight md:text-5xl">
        {site.nameDisplay}
      </h1>
      <p className="label-en mt-4">The Road Discovery Journal</p>

      <div className="prose-jp mt-12 space-y-6 text-sm text-text/85 md:text-base">
        <p>
          {site.name}
          は、日本全国のドライブコースを「探して・比較して・保存できる」ことを目指すドライブメディアです。
        </p>
        <p>
          コースはすべて、距離・所要時間・標高・ワインディング度などの実走データつき。カタログスペックではなく、実際に走って検証した情報だけを載せていきます。迷ったときに参照される、道の食べログのような存在になることが目標です。
        </p>
        <p>
          実走の様子はYouTubeで、日々の情報はXで発信しています。
        </p>
        <p>
          表示している数値の算出方法は、
          <Link href="/methodology" className="underline hover:text-text">
            データの出どころページ
          </Link>
          で詳しく説明しています。
        </p>
      </div>

      <div className="mt-12 flex gap-4">
        <a
          href={site.sns.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          YouTube →
        </a>
        <a
          href={site.sns.x}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          X →
        </a>
      </div>

      <p className="mt-16 text-xs text-muted">
        <Link href="/" className="underline hover:text-text">
          トップページへ戻る
        </Link>
      </p>
    </div>
  );
}
