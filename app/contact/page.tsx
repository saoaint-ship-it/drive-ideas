import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${site.name}へのお問い合わせページです。`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 md:px-8">
      <p className="label-en">Contact</p>
      <h1 className="mt-3 text-3xl font-medium md:text-4xl">お問い合わせ</h1>

      <div className="prose-jp mt-12 space-y-6 text-sm text-text/85 md:text-base">
        <p>
          コース情報の誤り・掲載内容についてのご指摘、取材・提携等のお問い合わせは、以下のメールアドレスまでご連絡ください。
        </p>

        <div className="border border-line px-6 py-8 text-center md:px-10">
          <p className="label-en text-muted">Email</p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-3 inline-block text-lg font-medium underline decoration-line underline-offset-4 hover:text-signal md:text-xl"
          >
            {site.contactEmail}
          </a>
        </div>

        <p className="text-xs text-muted">
          内容を確認の上、可能な範囲で返信いたします。お問い合わせ内容によっては返信までお時間をいただく場合や、返信いたしかねる場合がございます。あらかじめご了承ください。
        </p>
      </div>

      <p className="mt-16 text-xs text-muted">
        <Link href="/" className="underline hover:text-text">
          トップページへ戻る
        </Link>
      </p>
    </div>
  );
}
