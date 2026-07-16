import { AFFILIATE_DISCLOSURE } from "@/config/affiliates";

// ステマ規制対応の広告表記。広告リンクを含むページに表示する。
// show=false のときは何も表示しない（広告が無効なページで出さないため）。
export default function AffiliateDisclosure({
  show = true,
}: {
  show?: boolean;
}) {
  if (!show) return null;
  return <p className="text-xs text-muted">{AFFILIATE_DISCLOSURE}</p>;
}
