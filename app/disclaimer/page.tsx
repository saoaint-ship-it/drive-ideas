import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "免責事項",
  description: `${site.name}の免責事項です。`,
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 md:px-8">
      <p className="label-en">Disclaimer</p>
      <h1 className="mt-3 text-3xl font-medium md:text-4xl">免責事項</h1>

      <div className="prose-jp mt-12 space-y-10 text-sm text-text/85 md:text-base">
        <section>
          <h2 className="text-lg font-medium">掲載情報の正確性について</h2>
          <p className="mt-3">
            当サイトに掲載しているドライブコースの情報（距離・所要時間・通行規制・冬季閉鎖期間等）および記事の情報（法令・税額・車種スペック・料金等）は、掲載時点のものであり、可能な限り正確な情報を心がけていますが、その内容の正確性・安全性・最新性を保証するものではありません。
          </p>
          <p className="mt-3">
            道路状況・法令・料金・車種の仕様は変更されることがあります。実際にお出かけ・お手続き・お車選びをされる際は、必ず道路管理者・行政機関・販売店等の公式情報をあわせてご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">運転・安全に関する注意</h2>
          <p className="mt-3">
            当サイトで紹介するドライブコースには、山岳路・狭路・冬季閉鎖区間などが含まれます。運転は道路交通法・道路標識・現地の交通規制に従い、天候や道路状況に応じて安全運転を行ってください。当サイトの情報を利用したことにより生じた事故・損害等について、当サイトは一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">広告・アフィリエイトについて</h2>
          <p className="mt-3">
            当サイトは、Google
            アドセンス等の第三者配信広告、およびA8.net・もしもアフィリエイト・Amazonアソシエイト等のアフィリエイトプログラムを利用しています。商品・サービスの紹介記事やリンクには、該当する場合「PR」「広告」等の表記を行います。
          </p>
          <p className="mt-3">
            紹介する商品・サービスの品質・価格・在庫状況等については、各提供元・販売店の情報をご確認ください。これらの利用によって生じたトラブルについて、当サイトは責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">外部リンクについて</h2>
          <p className="mt-3">
            当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報・サービス・商品等について当サイトは一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">著作権について</h2>
          <p className="mt-3">
            当サイトに掲載する文章・写真・画像等の著作権は、当サイト運営者または正当な権利を有する第三者に帰属します。無断転載・複製・改変はご遠慮ください。著作権侵害等のご指摘がある場合は、
            <Link
              href="/contact"
              className="underline decoration-line underline-offset-4 hover:text-signal"
            >
              お問い合わせページ
            </Link>
            よりご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">免責事項の変更について</h2>
          <p className="mt-3">
            当サイトは、本免責事項の内容を予告なく変更することがあります。変更後の内容は、本ページに掲載した時点から効力を生じるものとします。
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
