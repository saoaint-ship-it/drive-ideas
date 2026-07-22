import { videos, type Video } from "@/data/videos";

// YouTube特集動画の「記事版」。動画の魅力を文章と写真で伝えつつ、
// 紹介コースを1枚のネオン地図で俯瞰し、各コース詳細・動画へつなぐ。
// コース一覧は videos.ts のチャプター(courseSlug)から自動で引く。

export type FeatureHighlight = {
  courseSlug: string;
  text: string; // その道の見どころを語る1〜2文
};

export type VideoFeature = {
  slug: string;
  videoId: string; // data/videos.ts の id と一致させる
  title: string;
  subtitle: string;
  description: string; // meta description
  intro: string[]; // 導入の段落(2〜3つ)
  highlights: FeatureHighlight[]; // 代表3コースの深掘り
  outro: string; // 締めの一文
};

export const features: VideoFeature[] = [
  {
    slug: "hokkaido-scenic-roads-14",
    videoId: "ZT4ucG3q8q8",
    title: "北海道の絶景ロード14選 — 最果ての直線から峠の樹海まで",
    subtitle: "日本のドライブの「規格外」が、ここに集まっている。",
    description:
      "オロロンライン・エサヌカ線・知床峠・ニセコパノラマライン——北海道の絶景ドライブコース14本を、空撮映像と実データで紹介。全コースの位置を1枚の地図で俯瞰できます。",
    intro: [
      "北海道の道は、本州の道と根本的にスケールが違います。地平線まで続く直線、行き交う車のいない原野、峠を越えた先に広がる大樹海。「運転する」というより「大地を移動する」という感覚は、この島でしか味わえません。",
      "この特集では、最北のサロベツ原野から襟裳岬まで、北海道の絶景ロード14本を厳選しました。それぞれの位置関係は下の地図で一目でわかります。数日かけて巡る北海道ドライブ旅の設計図として使ってください。",
    ],
    highlights: [
      {
        courseSlug: "ororon-line-sarobetsu",
        text: "日本海と湿原、そして海に浮かぶ利尻富士を同一画面に収める最北の一直線。人工物がほぼ無く、道路そのものが景色の主役になります。",
      },
      {
        courseSlug: "esanuka-line",
        text: "牧草地の中、信号も看板もない完全な直線。「何もない」ことがこれほどの絶景になるのは、おそらく日本でここだけです。",
      },
      {
        courseSlug: "mikuni-pass",
        text: "北海道の峠の最高峰。展望台から見下ろす十勝の大樹海と、樹海をまたぐ松見大橋のスケールは圧巻の一言。",
      },
    ],
    outro:
      "14本すべての詳細データ（距離・標高・カーブ数・立ち寄りスポット）は、各コースページで確認できます。",
  },
  {
    slug: "tohoku-scenic-roads-13",
    videoId: "82fxxrRM2CA",
    title: "東北の絶景ロード13選 — 山岳と海岸、火山と湖のドライブ",
    subtitle: "本州で最も「秘境感」の濃いエリアを走る。",
    description:
      "竜泊ライン・八幡平アスピーテライン・蔵王エコーライン・磐梯吾妻スカイライン——東北の絶景ドライブコース13本を空撮映像と実データで紹介。",
    intro: [
      "東北の道の魅力は「変化」です。海岸から一気に山岳へ駆け上がる竜泊ライン、火山の荒々しさに息をのむ磐梯吾妻スカイライン、雪の回廊で有名な八幡平と蔵王。1本ごとにまったく違う日本が現れます。",
      "首都圏からのアクセスも実は良好で、東北道を使えば福島の磐梯エリアまで約3時間。この特集の13本は、週末の1泊2日でも十分に組み合わせられます。",
    ],
    highlights: [
      {
        courseSlug: "tatsudomari-line",
        text: "津軽半島最北、龍飛崎から小泊へ。海岸線から標高400mのつづら折りへ一気に景色が切り替わる、東北随一のドラマチックな道。",
      },
      {
        courseSlug: "bandai-azuma-skyline",
        text: "浄土平を貫く火山景観の道。荒涼とした砂礫の大地は「日本離れ」という言葉がいちばん似合う場所です。",
      },
      {
        courseSlug: "zao-echo-line",
        text: "エメラルドグリーンの御釜へ続く山岳路。春の雪の回廊、夏の緑、秋の紅葉と、季節ごとに別の道になります。",
      },
    ],
    outro:
      "冬季閉鎖の道が多いエリアです。各コースページの閉鎖情報を確認してから計画を立ててください。",
  },
  {
    slug: "kanto-koshinetsu-scenic-roads-18",
    videoId: "0Kb8oFsGISk",
    title: "関東・甲信越の絶景ロード18選 — 富士・箱根からビーナスラインまで",
    subtitle: "日帰り圏内に、これだけの絶景が揃っている。",
    description:
      "箱根ターンパイク・ビーナスライン・富士スバルライン・いろは坂——関東・甲信越の絶景ドライブコース18本を空撮映像と実データで紹介。",
    intro: [
      "首都圏に住むドライバーは、実は世界有数の「絶景ロード密集地帯」に暮らしています。箱根・伊豆の海と山、富士五湖、日光、そして日本の高原ドライブの代名詞ビーナスライン。どれも日帰り圏内です。",
      "この特集の18本は、王道からやや通好みの道まで幅広く選びました。地図で位置関係を見ると「この2本は同じ日に走れる」という発見があるはずです。",
    ],
    highlights: [
      {
        courseSlug: "venus-line",
        text: "白樺湖から美ヶ原まで、標高2,000m級の高原を約75kmにわたって走る日本屈指のスケール。初めての人はまずここから。",
      },
      {
        courseSlug: "irohazaka",
        text: "「い」から「ん」まで48のカーブ標識を数えながら登る日本一有名なつづら折り。実測でヘアピン37箇所という当サイトのデータも見どころです。",
      },
      {
        courseSlug: "hakone-turnpike",
        text: "13kmのヒルクライムの先に、富士山と芦ノ湖の大観。走り・景色・アクセスの三拍子が揃った王道中の王道。",
      },
    ],
    outro:
      "18本を組み合わせた日帰りモデルプラン（箱根&伊豆・ビーナスライン）も用意しています。",
  },
  {
    slug: "kinki-scenic-roads-10",
    videoId: "ysqk8KEcgeE",
    title: "近畿の絶景ロード10選 — 湖と海と霊場をめぐる道",
    subtitle: "びわ湖・淡路島・高野山。関西の週末が変わる10本。",
    description:
      "メタセコイア並木・高野龍神スカイライン・比叡山ドライブウェイ・淡路サンセットライン——近畿の絶景ドライブコース10本を空撮映像と実データで紹介。",
    intro: [
      "近畿の絶景ロードは「水と歴史」が主役です。日本一の湖を囲むびわ湖エリア、夕日の名所が続く淡路島の西海岸、そして高野山から龍神温泉へと霊場の稜線を走るスカイライン。",
      "大阪・京都・神戸から1〜2時間圏内の道がほとんど。この特集の10本は、関西在住なら全制覇も難しくありません。",
    ],
    highlights: [
      {
        courseSlug: "metasequoia-namiki",
        text: "約500本のメタセコイアが2.4km続く、関西で最も有名な並木道。新緑・紅葉・雪と、四季で4回来たくなります。",
      },
      {
        courseSlug: "koya-ryujin-skyline",
        text: "高野山から龍神温泉へ、紀伊山地の稜線を約43km。関西最大級の山岳スカイラインは走りごたえも眺めも別格。",
      },
      {
        courseSlug: "awaji-sunset-line",
        text: "播磨灘に沈む夕日を追いかけて走る淡路島西海岸。夕方に走る計画を組むと、旅の締めくくりが劇的になります。",
      },
    ],
    outro:
      "びわ湖の名道4本をつないだ日帰りモデルプラン「関西発・びわ湖ぐるり絶景プラン」もあわせてどうぞ。",
  },
  {
    slug: "summer-scenic-roads-10",
    videoId: "CXrwddXP11c",
    title: "夏に走りたい日本の絶景ロード10選 — 海・高原・山岳の爽快ルート",
    subtitle: "暑さから逃げるなら、北へ、高くへ、海の上へ。",
    description:
      "知床峠から伊良部大橋まで、夏の爽快ドライブコース10本を空撮映像と実データで紹介。海・高原・山岳・カルスト台地を駆け抜ける。",
    intro: [
      "夏のドライブの鉄則は「標高を上げるか、海風に当たるか」。標高1,000mを超えれば気温は下界より6度以上低く、窓を開ければエアコンのいらない世界が待っています。",
      "この特集は、北海道の知床峠から沖縄の伊良部大橋まで、日本列島を縦断する夏の10本。夏休みの遠征先選びにどうぞ。",
    ],
    highlights: [
      {
        courseSlug: "shiretoko-odan",
        text: "世界自然遺産の半島を横断する道。羅臼岳を仰ぎ、国後島を望む峠からの眺めは、真夏でも空気がひんやりしています。",
      },
      {
        courseSlug: "venus-line",
        text: "夏のビーナスラインはニッコウキスゲの黄色に染まります。標高2,000mの涼しさは、最高の避暑ドライブ。",
      },
      {
        courseSlug: "irabu-bridge",
        text: "通行無料の橋としては日本最長の3,540m。エメラルドからコバルトへ変わる海の上を走る体験は、夏の沖縄の特権です。",
      },
    ],
    outro:
      "全10本の位置は上の地図の通り。北と南、今年の夏はどちらへ向かいますか。",
  },
  {
    slug: "painterly-roads-10",
    videoId: "5a46UywEF_E",
    title: "まるで絵画のような日本の美しい道10選",
    subtitle: "一枚の絵の中に、車ごと入り込む。",
    description:
      "メタセコイア並木・美瑛のパッチワークの路・角島大橋——まるで絵画のような日本の美しいドライブコース10本を空撮映像と実データで紹介。",
    intro: [
      "「絶景」と「絵になる景色」は、少し違います。この特集で選んだのは、写真に撮ったとき一枚の絵として成立する道。並木の消失点、丘の曲線、海に伸びる橋の直線——構図そのものが美しい10本です。",
      "カメラを持って出かけてください。どの道にも、定番の撮影ポイントをコースページに記載しています。",
    ],
    highlights: [
      {
        courseSlug: "biei-patchwork",
        text: "畑が織りなす色彩の丘。CMやポスターに使われ続ける理由は、走ればわかります。光の角度で表情が変わるので、朝夕が狙い目。",
      },
      {
        courseSlug: "tsunoshima-ohashi",
        text: "コバルトブルーの海に一直線に伸びる橋。日本の「海を渡る道」の代表格で、橋の手前の展望台からの構図が有名です。",
      },
      {
        courseSlug: "chirihama-nagisa",
        text: "日本で唯一、波打ち際の砂浜を車で走れる道。夕暮れ時、濡れた砂に空が映り込む時間帯が最も絵になります。",
      },
    ],
    outro:
      "愛車と絶景を美しく撮るコツは、読み物「愛車をかっこよく撮る方法」でも解説しています。",
  },
];

export function getFeatureBySlug(slug: string): VideoFeature | undefined {
  return features.find((f) => f.slug === slug);
}

export function getVideoForFeature(feature: VideoFeature): Video | undefined {
  return videos.find((v) => v.id === feature.videoId);
}

export function getFeatureByVideoId(videoId: string): VideoFeature | undefined {
  return features.find((f) => f.videoId === videoId);
}
