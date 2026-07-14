import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${site.name}のプライバシーポリシーです。`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 md:px-8">
      <p className="label-en">Privacy Policy</p>
      <h1 className="mt-3 text-3xl font-medium md:text-4xl">
        プライバシーポリシー
      </h1>

      <div className="prose-jp mt-12 space-y-10 text-sm text-text/85 md:text-base">
        <p>
          {site.name}（以下「当サイト」）は、利用者の個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
        </p>

        <section>
          <h2 className="text-lg font-medium">個人情報の収集について</h2>
          <p className="mt-3">
            当サイトでは、お問い合わせの際に、名前・メールアドレスなどの個人情報を入力いただく場合があります。これらの情報は、お問い合わせへの回答以外の目的では利用しません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">アクセス解析ツールについて</h2>
          <p className="mt-3">
            当サイトでは、Googleアナリティクスなどのアクセス解析ツールを使用しています。これらのツールはトラフィックデータの収集にCookieを使用しますが、この収集は匿名で行われており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが可能ですので、お使いのブラウザの設定をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">広告について</h2>
          <p className="mt-3">
            当サイトでは、第三者配信の広告サービス（Google
            アドセンス等）を利用する場合があります。このような広告配信事業者は、利用者の興味に応じた広告を表示するために、当サイトや他のサイトへのアクセスに関する情報
            （氏名、住所、メールアドレス、電話番号は含まれません）
            を使用することがあります。
          </p>
          <p className="mt-3">
            このプロセスの詳細やこのような情報が広告配信事業者に使用されないようにする方法については、
            <a
              href="https://policies.google.com/technologies/ads?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 hover:text-signal"
            >
              Google広告 – ポリシーと規約
            </a>
            をご覧ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">
            アフィリエイトプログラムについて
          </h2>
          <p className="mt-3">
            当サイトでは、商品・サービスの紹介にあたり、A8.net・もしもアフィリエイト・Amazonアソシエイト等のアフィリエイトプログラムを利用する場合があります。アフィリエイトプログラムを利用した紹介記事・リンクには、その旨（PR・広告等の表記）を明記します。
          </p>
          <p className="mt-3">
            これらのプログラムを通じて紹介する商品・サービスの購入や利用によって生じたトラブル・損害について、当サイトは一切の責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">免責事項</h2>
          <p className="mt-3">
            当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報・サービス等について当サイトは一切の責任を負いません。
          </p>
          <p className="mt-3">
            当サイトのコンテンツ・情報について、可能な限り正確な情報を掲載するよう努めておりますが、誤りや古い情報が含まれる場合があります。当サイトの情報を用いて行う一切の行為に関して、いかなる責任も負うものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">著作権について</h2>
          <p className="mt-3">
            当サイトで掲載している文章・画像等の著作権は、当サイト運営者または正当な権利を有する第三者に帰属します。無断での転載・複製・改変を禁止します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">プライバシーポリシーの変更について</h2>
          <p className="mt-3">
            当サイトは、法令の変更やサービス内容の変更等に応じて、本ポリシーの内容を予告なく変更することがあります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">お問い合わせ窓口</h2>
          <p className="mt-3">
            本ポリシーに関するお問い合わせは、
            <Link
              href="/contact"
              className="underline decoration-line underline-offset-4 hover:text-signal"
            >
              お問い合わせページ
            </Link>
            よりご連絡ください。
          </p>
        </section>
      </div>

      <p className="mt-16 text-xs text-muted">
        <Link href="/" className="underline hover:text-text">
          トップページへ戻る
        </Link>
      </p>
    </div>
  );
}
