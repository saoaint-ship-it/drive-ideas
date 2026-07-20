// YouTube「Holiday Ideas」チャンネルの絶景ドライブまとめ動画。
// 動画ページ(/videos)から参照する唯一のデータ源。
// chapters は動画のチャプター順。courseSlug があればサイト内のコース詳細ページへリンクする
// （サイトにページが無い道は courseSlug を省略し、リンクなしで表示する）。

export type VideoChapter = {
  timeSec: number; // チャプター開始秒（YouTubeの t= パラメータに使う）
  label: string; // 表示名（例: "ビーナスライン（長野県）"）
  courseSlug?: string; // 対応するコースページのslug。無ければリンクなし
};

export type Video = {
  id: string; // YouTube動画ID
  title: string;
  description: string;
  publishedAt: string;
  chapters: VideoChapter[];
};

export const videos: Video[] = [
  {
    id: "CXrwddXP11c",
    title: "夏に走りたい日本の絶景ロード10選",
    description:
      "北海道の知床峠から沖縄の伊良部大橋まで、海・高原・山岳・カルスト台地を駆け抜ける、夏の爽快ドライブコース10選。",
    publishedAt: "2026-07-15",
    chapters: [
      { timeSec: 10, label: "知床峠（北海道）", courseSlug: "shiretoko-odan" },
      { timeSec: 72, label: "磐梯吾妻スカイライン（福島県）", courseSlug: "bandai-azuma-skyline" },
      { timeSec: 134, label: "いろは坂・中禅寺湖（栃木県）", courseSlug: "irohazaka" },
      { timeSec: 196, label: "ビーナスライン（長野県）", courseSlug: "venus-line" },
      { timeSec: 258, label: "伊豆スカイライン（静岡県）", courseSlug: "izu-skyline" },
      { timeSec: 320, label: "伊勢志摩スカイライン（三重県）", courseSlug: "ise-shima-skyline" },
      { timeSec: 382, label: "しまなみ海道（広島県・愛媛県）", courseSlug: "shimanami-kaido" },
      { timeSec: 443, label: "秋吉台カルストロード（山口県）", courseSlug: "akiyoshidai-karst-road" },
      { timeSec: 505, label: "やまなみハイウェイ（大分県・熊本県）", courseSlug: "yamanami-highway" },
      { timeSec: 567, label: "伊良部大橋（沖縄県・宮古島）", courseSlug: "irabu-bridge" },
    ],
  },
  {
    id: "5a46UywEF_E",
    title: "まるで絵画のような日本の美しい道10選",
    description:
      "メタセコイア並木、美瑛のパッチワークの路、角島大橋など、まるで一枚の絵画に入り込んだような日本の美しい絶景ドライブコース10選。",
    publishedAt: "2026-07-15",
    chapters: [
      { timeSec: 13, label: "メタセコイア並木（滋賀県）", courseSlug: "metasequoia-namiki" },
      { timeSec: 87, label: "美瑛・パッチワークの路（北海道）", courseSlug: "biei-patchwork" },
      { timeSec: 147, label: "伊吹山ドライブウェイ（滋賀県・岐阜県）", courseSlug: "ibukiyama-driveway" },
      { timeSec: 207, label: "志賀草津高原ルート（長野県・群馬県）", courseSlug: "kusatsu-shiga" },
      { timeSec: 268, label: "阿蘇ミルクロード（熊本県）", courseSlug: "aso-milk-road" },
      { timeSec: 328, label: "日南フェニックスロード（宮崎県）", courseSlug: "nichinan-phoenix-road" },
      { timeSec: 388, label: "角島大橋（山口県）", courseSlug: "tsunoshima-ohashi" },
      { timeSec: 453, label: "西伊豆スカイライン（静岡県）", courseSlug: "nishi-izu-skyline" },
      { timeSec: 514, label: "千里浜なぎさドライブウェイ（石川県）", courseSlug: "chirihama-nagisa" },
      { timeSec: 578, label: "八幡平アスピーテライン（岩手県・秋田県）", courseSlug: "hachimantai-aspite-line" },
    ],
  },
];

// 秒を "M:SS" 形式に整形（例: 196 → "3:16"）
export function formatVideoTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export type VideoAppearance = { video: Video; chapter: VideoChapter };

// コースのslugが登場する動画チャプターを全動画から探す（コース詳細ページの動画導線用）
export function getVideoAppearancesForCourse(slug: string): VideoAppearance[] {
  const appearances: VideoAppearance[] = [];
  for (const video of videos) {
    for (const chapter of video.chapters) {
      if (chapter.courseSlug === slug) {
        appearances.push({ video, chapter });
      }
    }
  }
  return appearances;
}
