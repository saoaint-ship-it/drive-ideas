import { buildProductLinks } from "@/config/affiliates";
import AffiliateButton from "./AffiliateButton";

type Props = {
  keyword: string; // 検索キーワード（例:「ドライブレコーダー」）
  heading?: string; // 見出しを上書き
};

// 記事で紹介した商品を各ショップで探すための広告ボックス。
// 楽天市場・Yahoo!ショッピングのキーワード検索へ飛ぶ（rel="sponsored"・「広告」表記つき）。
export default function AffiliateShopLinks({ keyword, heading }: Props) {
  const links = buildProductLinks(keyword);
  if (links.length === 0) return null;

  return (
    <div className="border border-line p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-muted">広告</p>
      <p className="mt-2 text-base font-medium">
        {heading ?? `${keyword}を探す`}
      </p>
      <p className="prose-jp mt-1 text-sm text-muted">
        気になった製品は、各ショップで価格やレビューを比較できます。
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((l) => (
          <AffiliateButton key={l.name} href={l.href}>
            {l.name}で探す
          </AffiliateButton>
        ))}
      </div>
      {/* ASPの表示回数計測ビーコン(1px・見た目に影響なし) */}
      {links.map((l) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={l.name}
          src={l.impressionUrl}
          width={1}
          height={1}
          style={{ border: "none" }}
          alt=""
          loading="lazy"
        />
      ))}
    </div>
  );
}
