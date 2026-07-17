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

// ── 商品検索の広告ショップ ──────────────────────────────
// もしもアフィリエイトの「どこでもリンク」のトラッキングIDを使い、
// キーワードから各ショップの検索結果へ飛ばす。clickBase の末尾に &url= で飛び先を付ける。

type ProductShop = {
  name: string; // 表示名
  clickBase: string; // クリック計測URL(ID付き)
  impressionUrl: string; // 表示計測1px
  searchUrl: (keyword: string) => string; // キーワード→検索URL
};

const productShops: ProductShop[] = [
  {
    name: "楽天市場",
    clickBase:
      "https://af.moshimo.com/af/c/click?a_id=5700441&p_id=54&pc_id=54&pl_id=616",
    impressionUrl:
      "https://i.moshimo.com/af/i/impression?a_id=5700441&p_id=54&pc_id=54&pl_id=616",
    searchUrl: (k) =>
      `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(k)}/`,
  },
  {
    name: "Yahoo!ショッピング",
    clickBase:
      "https://af.moshimo.com/af/c/click?a_id=5700495&p_id=1225&pc_id=1925&pl_id=18502",
    impressionUrl:
      "https://i.moshimo.com/af/i/impression?a_id=5700495&p_id=1225&pc_id=1925&pl_id=18502",
    searchUrl: (k) => `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(k)}`,
  },
];

export type ProductLink = {
  name: string;
  href: string;
  impressionUrl: string;
};

// キーワードから各ショップの広告リンクを生成
export function buildProductLinks(keyword: string): ProductLink[] {
  return productShops.map((s) => ({
    name: s.name,
    href: `${s.clickBase}&url=${encodeURIComponent(s.searchUrl(keyword))}`,
    impressionUrl: s.impressionUrl,
  }));
}

// 商品リンクを表示する記事: slug → 検索キーワード
export const productArticleKeywords: Record<string, string> = {
  "dashcam-ranking-2026": "ドライブレコーダー",
  "comfort-seat-ranking-2026": "車 シートクッション",
  "winter-tire-chain-guide": "タイヤチェーン",
  "in-car-organizing": "車 収納 グッズ",
  "drive-music-guide": "車 スピーカー",
  "pet-drive-guide": "犬 ドライブ グッズ",
  "car-wash-basics": "洗車 グッズ",
  "navi-app-ranking-2026": "車載 スマホホルダー",
};
