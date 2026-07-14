import { getAllCourses } from "@/lib/courses";
import { getAllArticles } from "@/lib/articles";

// サイト内で使う素材の「枠」の台帳。
// 素材管理画面(/admin)とアップロードAPIはこの台帳を基準に動く。
// 枠のパスは固定で、同じ場所にファイルを置き換えればサイトに即反映される。

export type AssetSlot = {
  id: string;
  group: string; // 見出し（コース名など）
  label: string; // 枠の名前
  path: string; // publicからのパス（このパスにファイルを置くと反映）
  kind: "image" | "video";
  usage: string; // サイト内のどこに出るか
  wanted: string; // どんな素材が欲しいか
  searchQuery?: string; // 素材サイトで検索するときのキーワード
};

// コースごとの「欲しい写真」の説明
const COURSE_WANTED: Record<string, string> = {
  "sky-road-shari":
    "まっすぐな一本道が地平線や空に向かって伸びている構図。夏の青空か夕暮れ",
  irohazaka:
    "つづら折りのカーブを俯瞰した写真。紅葉シーズンが理想。カーブ標識のアップも可",
  "venus-line":
    "視界の開けた高原の道。草原・稜線・空の面積が大きい写真。夏の緑か秋の草紅葉",
  "metasequoia-namiki":
    "並木のトンネルを正面から見た写真。新緑・紅葉・雪など季節違いがあると尚良し",
  "tsunoshima-ohashi":
    "エメラルドグリーンの海に伸びる橋。展望台からの俯瞰がベスト。晴天の干潮時",
  "aso-panorama-line":
    "草原の中のワインディングとカルデラの風景。放牧中の牛馬が写っていると最高",
  "bandai-azuma-skyline":
    "火山礫の荒涼とした風景の中を走る道。浄土平・吾妻小富士周辺。雪の回廊も可",
  "hachimantai-aspite-line":
    "なだらかな高原を横断する道と岩手山。雪の回廊・新緑・紅葉いずれでも",
  "izu-skyline":
    "稜線の道と富士山(または海)が同時に写った写真。冬の澄んだ空気の日がベスト",
  "hakone-turnpike":
    "幅の広い登り坂のワインディング。大観山からの芦ノ湖+富士山の構図も可",
  "shimanami-kaido":
    "海峡に架かる大橋。亀老山展望公園からの俯瞰、または橋上からの多島美",
  "ufo-line":
    "笹原の稜線に延びる一車線の道。山と雲海。CMで有名になったアングル",
};

export function getAssetSlots(): AssetSlot[] {
  const slots: AssetSlot[] = [];

  // サイト共通
  slots.push(
    {
      id: "site:logo",
      group: "サイト共通",
      label: "ロゴ",
      path: "/images/logo.jpg",
      kind: "image",
      usage: "ヘッダー / トップページ / About",
      wanted: "円形ロゴ。正方形で500px以上",
    },
    {
      id: "site:hero-video",
      group: "サイト共通",
      label: "トップページ背景動画",
      path: "/videos/hero.mp4",
      kind: "video",
      usage: "トップページの全画面ヒーロー",
      wanted:
        "走行シーンのループ動画。10〜30秒・横1920px・音声不要。車窓か空撮",
    }
  );

  // コースごと
  for (const course of getAllCourses()) {
    const group = `${course.name}（${course.prefectures.join("・")}）`;
    const wanted =
      COURSE_WANTED[course.slug] ??
      `「${course.catchcopy}」の雰囲気が伝わる、${course.name}の象徴的な風景写真`;

    slots.push({
      id: `course:${course.slug}:hero`,
      group,
      label: "メイン写真",
      path: `/images/courses/${course.slug}/hero.jpg`,
      kind: "image",
      usage: "詳細ページ冒頭の全画面 / 一覧カード / トップの特集",
      wanted: `${wanted}。横長・2000px以上推奨`,
      searchQuery: course.name.replace(/（.*?）/g, ""),
    });

    course.gallery.forEach((g, i) => {
      slots.push({
        id: `course:${course.slug}:gallery-${i + 1}`,
        group,
        label: `ギャラリー ${i + 1}`,
        path: g,
        kind: "image",
        usage: "詳細ページ「沿道の風景」欄",
        wanted: `メイン写真とは別アングル・別の季節や時間帯の${course.name}`,
        searchQuery: course.name.replace(/（.*?）/g, ""),
      });
    });

    course.spots.forEach((spot, i) => {
      slots.push({
        id: `course:${course.slug}:spot-${i + 1}`,
        group,
        label: `スポット: ${spot.name}`,
        path: `/images/courses/${course.slug}/spot-${i + 1}.jpg`,
        kind: "image",
        usage: "詳細ページ「立ち寄りスポット」のカード",
        wanted: `「${spot.name}」(${spot.type})の写真${spot.note ? `。${spot.note}` : ""}`,
        searchQuery: spot.name.replace(/（.*?）/g, ""),
      });
    });
  }

  // 記事ごと
  for (const article of getAllArticles()) {
    const group = `記事: ${article.title.slice(0, 24)}${article.title.length > 24 ? "…" : ""}`;

    slots.push({
      id: `journal:${article.slug}:hero`,
      group,
      label: "記事メイン写真",
      path: article.heroImage,
      kind: "image",
      usage: "記事ページ上部 / 記事一覧カード / トップの記事欄",
      wanted: "記事テーマを象徴する写真。横長・2000px以上推奨",
      searchQuery: article.photoQuery,
    });

    // 本文中の画像 ![alt](path) を抽出
    const matches = [...article.body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    matches.forEach((m, i) => {
      slots.push({
        id: `journal:${article.slug}:inline-${i + 1}`,
        group,
        label: `記事内写真 ${i + 1}`,
        path: m[2],
        kind: "image",
        usage: "記事本文の途中",
        wanted: m[1] || "本文の流れに合う写真",
      });
    });
  }

  return slots;
}
