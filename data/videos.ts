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
    id: "ysqk8KEcgeE",
    title: "近畿の絶景ロード10選",
    description:
      "メタセコイア並木から淡路サンセットラインまで、湖畔・山岳・海岸を巡る、近畿の絶景ドライブコース10選。",
    publishedAt: "2026-07-21",
    chapters: [
      { timeSec: 11, label: "メタセコイア並木（滋賀県）", courseSlug: "metasequoia-namiki" },
      { timeSec: 57, label: "六甲山ドライブ（山上ルート）（兵庫県）", courseSlug: "rokko-drive" },
      { timeSec: 98, label: "高野龍神スカイライン（和歌山県）", courseSlug: "koya-ryujin-skyline" },
      { timeSec: 140, label: "県道24号 白崎海岸（和歌山県）", courseSlug: "shirasaki-coast" },
      { timeSec: 186, label: "熊野川ルート（和歌山県）", courseSlug: "kumanogawa-route" },
      { timeSec: 229, label: "奥琵琶湖パークウェイ（滋賀県）", courseSlug: "oku-biwako-parkway" },
      { timeSec: 274, label: "比叡山ドライブウェイ（滋賀県・京都府）", courseSlug: "hieizan-driveway" },
      { timeSec: 315, label: "海津大崎（滋賀県）", courseSlug: "kaizu-osaki" },
      { timeSec: 358, label: "淡路サンセットライン（兵庫県）", courseSlug: "awaji-sunset-line" },
      { timeSec: 401, label: "丹後半島・海の京都ライン（京都府）", courseSlug: "tango-peninsula" },
    ],
  },
  {
    id: "0Kb8oFsGISk",
    title: "関東・甲信越の絶景ロード18選",
    description:
      "富士山・箱根・ビーナスライン・房総まで、関東甲信越の一度は走りたい絶景ドライブコース18選。",
    publishedAt: "2026-07-20",
    chapters: [
      { timeSec: 11, label: "箱根ターンパイク（神奈川県）", courseSlug: "hakone-turnpike" },
      { timeSec: 52, label: "ビーナスライン（長野県）", courseSlug: "venus-line" },
      { timeSec: 93, label: "美ヶ原高原道路（長野県）", courseSlug: "utsukushigahara-highland" },
      { timeSec: 135, label: "志賀草津高原ルート（群馬県・長野県）", courseSlug: "kusatsu-shiga" },
      { timeSec: 176, label: "奥多摩周遊道路（東京都）", courseSlug: "okutama-shuyu" },
      { timeSec: 221, label: "メルヘン街道・麦草峠（長野県）", courseSlug: "merhen-kaido" },
      { timeSec: 262, label: "御岳スカイライン（長野県）", courseSlug: "ontake-skyline" },
      { timeSec: 304, label: "富士スバルライン（山梨県）", courseSlug: "fuji-subaru-line" },
      { timeSec: 347, label: "本栖湖周回ルート（山梨県）", courseSlug: "motosuko-loop" },
      { timeSec: 391, label: "芦ノ湖スカイライン・箱根スカイライン（神奈川県・静岡県）", courseSlug: "ashinoko-hakone-skyline" },
      { timeSec: 433, label: "いろは坂（栃木県）", courseSlug: "irohazaka" },
      { timeSec: 479, label: "妙義山道路（群馬県）", courseSlug: "myogisan-road" },
      { timeSec: 522, label: "榛名湖メロディライン（群馬県）", courseSlug: "haruna-melody-line" },
      { timeSec: 565, label: "日塩もみじライン（栃木県）", courseSlug: "nishio-momiji-line" },
      { timeSec: 606, label: "大佐渡スカイライン（新潟県）", courseSlug: "osado-skyline" },
      { timeSec: 648, label: "笹川流れ（新潟県）", courseSlug: "sasagawa-nagare" },
      { timeSec: 691, label: "弥彦山スカイライン（新潟県）", courseSlug: "yahikoyama-skyline" },
      { timeSec: 732, label: "房総フラワーライン（千葉県）", courseSlug: "boso-flower-line" },
    ],
  },
  {
    id: "82fxxrRM2CA",
    title: "東北の絶景ロード13選",
    description:
      "竜泊ラインから大間越街道まで、奥入瀬・八幡平・蔵王・磐梯吾妻を巡る、東北の絶景ドライブコース13選。",
    publishedAt: "2026-07-19",
    chapters: [
      { timeSec: 11, label: "竜泊ライン（青森県）", courseSlug: "tatsudomari-line" },
      { timeSec: 36, label: "尻屋崎道路（青森県）", courseSlug: "shiriyazaki" },
      { timeSec: 62, label: "十和田湖・奥入瀬渓流ライン（青森県）", courseSlug: "towada-oirase" },
      { timeSec: 89, label: "八幡平アスピーテライン（岩手県・秋田県）", courseSlug: "hachimantai-aspite-line" },
      { timeSec: 115, label: "桜と菜の花ロード（秋田県）", courseSlug: "sakura-nanohana-road" },
      { timeSec: 140, label: "鳥海ブルーライン（山形県・秋田県）", courseSlug: "chokai-blue-line" },
      { timeSec: 166, label: "八甲田・十和田ゴールドライン（青森県）", courseSlug: "hakkoda-towada-gold-line" },
      { timeSec: 192, label: "蔵王エコーライン（宮城県・山形県）", courseSlug: "zao-echo-line" },
      { timeSec: 219, label: "磐梯吾妻スカイライン（福島県）", courseSlug: "bandai-azuma-skyline" },
      { timeSec: 251, label: "磐梯山ゴールドライン（福島県）", courseSlug: "bandai-gold-line" },
      { timeSec: 276, label: "磐梯吾妻レークライン（福島県）", courseSlug: "bandai-azuma-lakeline" },
      { timeSec: 302, label: "田子倉湖（福島県）", courseSlug: "tagokura-lake" },
      { timeSec: 328, label: "大間越街道（青森県・秋田県）", courseSlug: "oma-goe-kaido" },
    ],
  },
  {
    id: "ZT4ucG3q8q8",
    title: "北海道の絶景ロード14選",
    description:
      "オロロンライン・知床・美瑛・ニセコまで、北海道の一度は走りたい絶景ドライブコース14選。",
    publishedAt: "2026-07-18",
    chapters: [
      { timeSec: 11, label: "オロロンライン（石狩〜増毛）（北海道）", courseSlug: "ororon-line" },
      { timeSec: 36, label: "宗谷丘陵 白い道（北海道）", courseSlug: "soya-white-road" },
      { timeSec: 62, label: "エサヌカ線（北海道）", courseSlug: "esanuka-line" },
      { timeSec: 87, label: "知床横断道路（北海道）", courseSlug: "shiretoko-odan" },
      { timeSec: 116, label: "天に続く道（北海道）", courseSlug: "sky-road-shari" },
      { timeSec: 144, label: "阿寒横断道路（北海道）", courseSlug: "akan-crossing-road" },
      { timeSec: 171, label: "北太平洋シーサイドライン（北海道）", courseSlug: "north-pacific-seaside" },
      { timeSec: 196, label: "美幌峠（北海道）", courseSlug: "bihoro-pass" },
      { timeSec: 222, label: "三国峠（北海道）", courseSlug: "mikuni-pass" },
      { timeSec: 249, label: "ニセコパノラマライン（北海道）", courseSlug: "niseko-panorama-line" },
      { timeSec: 275, label: "積丹ブルーロード（国道229号）（北海道）", courseSlug: "shakotan-blue-road" },
      { timeSec: 300, label: "襟裳岬（北海道）", courseSlug: "erimo-cape" },
      { timeSec: 326, label: "ジェットコースターの路（北海道）", courseSlug: "jet-coaster-road" },
      { timeSec: 352, label: "美瑛パノラマロード（北海道）", courseSlug: "biei-panorama-road" },
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
      { timeSec: 87, label: "美瑛パッチワークの路（北海道）", courseSlug: "biei-patchwork" },
      { timeSec: 147, label: "伊吹山ドライブウェイ（滋賀県）", courseSlug: "ibukiyama-driveway" },
      { timeSec: 207, label: "志賀草津高原ルート（群馬県・長野県）", courseSlug: "kusatsu-shiga" },
      { timeSec: 268, label: "阿蘇ミルクロード（熊本県）", courseSlug: "aso-milk-road" },
      { timeSec: 328, label: "日南フェニックスロード（宮崎県）", courseSlug: "nichinan-phoenix-road" },
      { timeSec: 388, label: "角島大橋周辺（山口県）", courseSlug: "tsunoshima-ohashi" },
      { timeSec: 453, label: "西伊豆スカイライン（静岡県）", courseSlug: "nishi-izu-skyline" },
      { timeSec: 514, label: "千里浜なぎさドライブウェイ（石川県）", courseSlug: "chirihama-nagisa" },
      { timeSec: 578, label: "八幡平アスピーテライン（岩手県・秋田県）", courseSlug: "hachimantai-aspite-line" },
    ],
  },
  {
    id: "CXrwddXP11c",
    title: "夏に走りたい日本の絶景ロード10選",
    description:
      "北海道の知床峠から沖縄の伊良部大橋まで、海・高原・山岳・カルスト台地を駆け抜ける、夏の爽快ドライブコース10選。",
    publishedAt: "2026-07-14",
    chapters: [
      { timeSec: 10, label: "知床横断道路（北海道）", courseSlug: "shiretoko-odan" },
      { timeSec: 72, label: "磐梯吾妻スカイライン（福島県）", courseSlug: "bandai-azuma-skyline" },
      { timeSec: 134, label: "いろは坂（栃木県）", courseSlug: "irohazaka" },
      { timeSec: 196, label: "ビーナスライン（長野県）", courseSlug: "venus-line" },
      { timeSec: 258, label: "伊豆スカイライン（静岡県）", courseSlug: "izu-skyline" },
      { timeSec: 320, label: "伊勢志摩スカイライン（三重県）", courseSlug: "ise-shima-skyline" },
      { timeSec: 382, label: "しまなみ海道（広島県・愛媛県）", courseSlug: "shimanami-kaido" },
      { timeSec: 443, label: "秋吉台カルストロード（山口県）", courseSlug: "akiyoshidai-karst-road" },
      { timeSec: 505, label: "やまなみハイウェイ（大分県・熊本県）", courseSlug: "yamanami-highway" },
      { timeSec: 567, label: "伊良部大橋（沖縄県）", courseSlug: "irabu-bridge" },
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
