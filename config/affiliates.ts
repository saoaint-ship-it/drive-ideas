// アフィリエイト設定の一元管理。
// ASP(もしもアフィリエイト等)で発行したリンクURLを各プログラムの url に入れると、
// 対応する広告ボックスがサイト上に表示される（url が空の間は一切表示されない）。
// 広告リンクには自動で rel="sponsored nofollow" と「広告」表記が付く（ステマ規制・SEO対応）。

export type AffiliateId = "hotel" | "rentalcar" | "carValuation" | "carInsurance";

export type AffiliateProgram = {
  id: AffiliateId;
  label: string; // ボタンの文言
  note: string; // ボタン上の補足説明
  url: string; // ASPで発行したリンク。空文字の間は非表示
  impressionUrl?: string; // ASPの表示計測用ビーコン(1px画像)。あれば広告ボックス内に埋め込む
};

export const affiliatePrograms: Record<AffiliateId, AffiliateProgram> = {
  hotel: {
    id: "hotel",
    label: "周辺の宿を探す",
    note: "このドライブの拠点に。楽天トラベルで宿泊先を検索できます。",
    // もしもアフィリエイト経由の楽天トラベル(どこでもリンク)
    url: "https://af.moshimo.com/af/c/click?a_id=5700443&p_id=55&pc_id=55&pl_id=624&url=https%3A%2F%2Ftravel.rakuten.co.jp%2F",
    impressionUrl:
      "https://i.moshimo.com/af/i/impression?a_id=5700443&p_id=55&pc_id=55&pl_id=624",
  },
  rentalcar: {
    id: "rentalcar",
    label: "レンタカーを探す",
    note: "遠方のコースは現地調達が便利。たびらいレンタカーで料金を比較できます。",
    // もしもアフィリエイト経由のたびらいレンタカー(自由テキスト素材)
    url: "https://af.moshimo.com/af/c/click?a_id=5700480&p_id=5701&pc_id=15749&pl_id=73376",
    impressionUrl:
      "https://i.moshimo.com/af/i/impression?a_id=5700480&p_id=5701&pc_id=15749&pl_id=73376",
  },
  carValuation: {
    id: "carValuation",
    label: "愛車の価値を無料査定",
    note: "今の車がいくらで売れるか、一括査定でまとめて比較できます。",
    url: "", // ← 車一括査定リンク
  },
  carInsurance: {
    id: "carInsurance",
    label: "自動車保険を一括見積もり",
    note: "複数社の保険料をまとめて比較できます。",
    url: "", // ← 自動車保険一括見積もりリンク
  },
};

// url が設定済み（＝表示可能）かどうか
export function isAffiliateActive(id: AffiliateId): boolean {
  return affiliatePrograms[id].url.trim().length > 0;
}

// 表示可能なプログラムを返す。未設定なら null
export function getAffiliate(id: AffiliateId): AffiliateProgram | null {
  return isAffiliateActive(id) ? affiliatePrograms[id] : null;
}

// ステマ規制対応の広告表記文言
export const AFFILIATE_DISCLOSURE =
  "※本ページはアフィリエイト広告（PR）を含みます。";
