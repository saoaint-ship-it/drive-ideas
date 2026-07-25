import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "データの出どころと算出方法",
  description:
    "距離・標高・カーブ数・勾配など、Drive Ideasが表示している数値がどう作られているか。ルート検証の方法と、数値の限界について。",
  alternates: { canonical: "/methodology" },
};

const STEPS = [
  {
    n: "01",
    title: "ルートを、実在する道路網から取得する",
    body: "各コースの経路は、地図上に手で線を引いているのではなく、OSRM(オープンな道路経路計算エンジン)に実際の道路網を通らせて取得しています。取得のたびに「steps=true」で通過した道路名を確認し、その道の国道・県道番号や愛称と一致するかを照合しています。",
  },
  {
    n: "02",
    title: "標高は、公開されている地形データから実測する",
    body: "最高標高・獲得標高・標高プロファイルは、ASTER GDEM(世界の地形を約30m間隔で記録した公開データ)から、ルート上を一定間隔でサンプリングして算出しています。カタログ値や伝聞ではなく、そのルートの座標そのものから測った数値です。",
  },
  {
    n: "03",
    title: "カーブ・ヘアピン・勾配は、ルート形状から自動計算する",
    body: "ルートの線を約30mおきに区切り、進行方向の変化(ヘディング角)を追跡して、一定区間内の累積回転が60°以上ならカーブ、150°以上ならヘアピンとしてカウントしています。最大勾配は、標高プロファイルの区間平均から算出した目安値です。実際の道路標識の数値とは異なる場合があります。",
  },
  {
    n: "04",
    title: "ランキング・日本記録・全国順位は、この実測値から生成する",
    body: "/rankings や /records、コース詳細ページの「全国◯位」バッジは、上記の手順で算出した数値を全コースで横並びに比較して自動生成しています。人力で順位をつけているわけではないため、コースが増えるたびに順位も自動的に更新されます。",
  },
  {
    n: "05",
    title: "空撮動画は、実際のルート座標を地図上でなぞって撮影する",
    body: "各コースの空撮風動画は、①のルート座標をネオン調の地図上に描画し、その線に沿ってカメラが回り込む形で1本ずつ収録しています。CGで適当に道を描いているのではなく、実際に取得した経路データをそのまま使っています。",
  },
];

export default function MethodologyPage() {
  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="label-en">Methodology</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">
          データの出どころと算出方法
        </h1>
        <p className="prose-jp mt-5 text-sm text-muted md:text-base">
          {site.name}
          が表示している距離・標高・カーブ数・勾配・ランキングは、感覚や伝聞ではなく、実在する道路データと公開されている地形データから算出しています。ここでは、その仕組みを隠さずに説明します。
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-5 md:px-8">
        <ol className="space-y-14">
          {STEPS.map((s) => (
            <li key={s.n} className="border-t border-line pt-8">
              <p className="label-en">{s.n}</p>
              <h2 className="mt-2 text-xl font-medium md:text-2xl">
                {s.title}
              </h2>
              <p className="prose-jp mt-4 text-sm text-text/85 md:text-base">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-5 md:px-8">
        <div className="border border-signal/50 px-6 py-6">
          <p className="label-en">Limitations</p>
          <h2 className="mt-2 text-lg font-medium">数値の限界について</h2>
          <ul className="prose-jp mt-4 space-y-3 text-sm text-text/85">
            <li>
              カーブ数・ヘアピン数・最大勾配は自動計算した「目安値」です。実際の道路標識やカーナビの数値とは一致しないことがあります。
            </li>
            <li>
              距離・標高は紹介している走破区間についての数値です。同じ愛称の道でも、区間の取り方によって数値は変わります。
            </li>
            <li>
              通行規制・冬季閉鎖の期間は例年の目安です。年や天候によって前後するため、走行前に道路管理者の公式発表を必ずご確認ください（
              <Link href="/closures" className="underline hover:text-text">
                まとめページはこちら
              </Link>
              ）。
            </li>
            <li>
              ルートは新規追加・修正のたびに道路名の照合と標高の目視確認を行っていますが、地図データの更新や道路の付け替えにより、実際の道と差異が生じる場合があります。
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl px-5 md:px-8">
        <p className="prose-jp text-sm text-muted">
          ルートや数値の誤りにお気づきの場合は、
          <a
            href={`mailto:${site.contactEmail}`}
            className="underline hover:text-text"
          >
            お問い合わせ
          </a>
          からお知らせください。確認のうえ、随時修正しています。
        </p>
      </div>
    </div>
  );
}
