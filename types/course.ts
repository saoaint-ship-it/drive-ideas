export type SpotType =
  | "展望"
  | "撮影"
  | "グルメ"
  | "道の駅"
  | "給油"
  | "EV充電"
  | "トイレ"
  | "駐車場";

export type Region =
  | "北海道"
  | "東北"
  | "関東"
  | "中部"
  | "近畿"
  | "中国"
  | "四国"
  | "九州・沖縄";

export type RoadType =
  | "峠"
  | "海岸線"
  | "高原"
  | "湖畔"
  | "街道"
  | "林道"
  | "橋・海上";

export type Season = "春" | "初夏" | "夏" | "秋" | "冬";

export type CarType = "軽" | "ミニバン" | "スポーツ" | "EV" | "オープン";

export type Difficulty = "初心者向け" | "中級" | "上級";

export type Spot = {
  name: string;
  type: SpotType;
  lat: number;
  lng: number;
  note?: string;
};

export type Closure = {
  type: "冬季閉鎖" | "夜間通行止め" | "時間帯規制";
  period: string;
  openingDateNote?: string;
};

export type Course = {
  slug: string;
  name: string;
  prefectures: string[];
  region: Region;
  catchcopy: string;
  summary: string;

  // 「計器」として表示するコアスペック
  distanceKm: number;
  durationMin: number; // 走破の目安時間（休憩なし）
  elevationGainM: number;
  maxElevationM: number;
  windingLevel: 1 | 2 | 3 | 4 | 5;
  difficulty: Difficulty;

  // 絞り込み軸
  roadTypes: RoadType[];
  toll: "無料" | "有料";
  tollNote?: string;
  bestSeasons: Season[];
  bestMonths: number[];
  narrowRoadWarning: boolean;
  suitableFor: CarType[];

  // 通行規制（このサイトの差別化ポイント）
  closure?: Closure;

  // 地図
  center: { lat: number; lng: number };
  path: [number, number][]; // [lng, lat]
  spots: Spot[];

  // 標高プロファイル（スタートからの等間隔サンプル・メートル）
  elevationProfile: number[];

  // メディア
  heroImage: string;
  gallery: string[];
  youtubeId?: string;

  // 本文（詳細ページ下部の読み物パート）
  body: {
    heading: string;
    text: string;
  }[];

  cautions: string[];
  updatedAt: string;
};
