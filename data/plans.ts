// 日帰りモデルプラン。複数のコースと立ち寄りをつないだ「そのまま走れる」1日の設計図。
// 所要時間・時刻はすべて目安(交通状況・季節で大きく変わる)。

export type PlanStop = {
  time: string; // "6:00" など目安時刻
  title: string;
  note?: string;
  courseSlug?: string; // 該当するコースがあればリンク
};

export type DrivePlan = {
  slug: string;
  title: string;
  origin: string; // 出発地
  catchcopy: string;
  description: string; // meta description兼リード
  season: string; // おすすめの季節
  totalKmApprox: string; // 総走行距離の目安
  courseSlugs: string[]; // 含まれるコース
  schedule: PlanStop[];
  tips: string[];
};

export const plans: DrivePlan[] = [
  {
    slug: "tokyo-venus-line",
    title: "東京発・ビーナスライン天空プラン",
    origin: "東京",
    catchcopy: "標高2,000mの雲の上まで、日帰りで。",
    description:
      "東京から日帰りで、ビーナスライン〜美ヶ原高原の天空ルートを走り切るモデルプラン。出発時刻から立ち寄りまで、そのまま使える1日の設計図。",
    season: "5月〜10月(冬季は閉鎖区間あり)",
    totalKmApprox: "往復 約450km",
    courseSlugs: ["venus-line", "utsukushigahara-highland"],
    schedule: [
      { time: "6:00", title: "東京を出発", note: "中央道で諏訪方面へ。朝の渋滞前に都心を抜けるのが最大のコツ" },
      { time: "8:45", title: "諏訪IC付近で休憩・給油", note: "山に上がる前に満タンに。コンビニ調達もここで" },
      { time: "9:30", title: "白樺湖からビーナスラインへ", courseSlug: "venus-line", note: "車山高原→霧ヶ峰と、視界がどんどん開けていく" },
      { time: "11:00", title: "霧ヶ峰・富士見台で展望休憩", note: "晴れていれば富士山・八ヶ岳・北アルプスの三役揃い踏み" },
      { time: "12:30", title: "美ヶ原高原道路で標高2,000mへ", courseSlug: "utsukushigahara-highland", note: "道の駅美ヶ原高原で昼食。日本一標高の高い道の駅のひとつ" },
      { time: "14:30", title: "下山開始", note: "来た道を戻らず扉峠→松本方面に下りると景色が二度おいしい" },
      { time: "16:00", title: "諏訪湖畔で温泉休憩(任意)", note: "上諏訪温泉の日帰り湯で運転の疲れをリセット" },
      { time: "19:30", title: "東京着", note: "小仏トンネルの渋滞を見越して、諏訪を17時前に出るのが安全" },
    ],
    tips: [
      "夏でも山頂部は15℃前後。羽織るものを必ず持参",
      "霧ヶ峰周辺は霧が出やすい。午前中の早い時間が晴天率高め",
      "GW・夏休み・紅葉期は帰りの中央道渋滞が長い。1時間早い行動を",
    ],
  },
  {
    slug: "tokyo-hakone-izu",
    title: "東京発・箱根&伊豆スカイライン三昧",
    origin: "東京",
    catchcopy: "3本の名道を1日ではしごする、王道の稜線ドライブ。",
    description:
      "箱根ターンパイク・芦ノ湖スカイライン・伊豆スカイラインを1日で走り継ぐ欲張りプラン。富士山・芦ノ湖・駿河湾・相模湾を全部見る。",
    season: "通年(冬は路面凍結に注意)",
    totalKmApprox: "往復 約280km",
    courseSlugs: ["hakone-turnpike", "ashinoko-hakone-skyline", "izu-skyline"],
    schedule: [
      { time: "6:30", title: "東京を出発", note: "小田原厚木道路経由で箱根へ" },
      { time: "8:00", title: "箱根ターンパイクを駆け上がる", courseSlug: "hakone-turnpike", note: "朝の光の中、13kmのヒルクライム。大観山で富士山と芦ノ湖の定番構図" },
      { time: "9:30", title: "芦ノ湖スカイライン・箱根スカイライン", courseSlug: "ashinoko-hakone-skyline", note: "稜線から左に駿河湾、右に芦ノ湖" },
      { time: "11:00", title: "熱海峠から伊豆スカイラインへ", courseSlug: "izu-skyline", note: "相模湾を見下ろす天空路。玄岳付近の展望が白眉" },
      { time: "12:30", title: "亀石峠付近で昼食", note: "PAの軽食か、少し下りて伊豆の海鮮もあり" },
      { time: "14:00", title: "冷川ICまで完走→折り返し", note: "余力があれば往復で景色の向きが変わる伊豆スカイラインをもう一度" },
      { time: "16:00", title: "熱海で温泉 or そのまま帰路", note: "熱海市街は渋滞しやすいので温泉は駅から離れた施設が狙い目" },
      { time: "18:30", title: "東京着", note: "西湘バイパス→小田原厚木道路が海沿いで気持ちいい帰り道" },
    ],
    tips: [
      "3本とも有料。現金しか使えない料金所があるので小銭の用意を",
      "冬の早朝は路面凍結あり。1〜2月はスタッドレス推奨",
      "富士山狙いなら空気の澄んだ冬の午前中が最強",
    ],
  },
  {
    slug: "kansai-biwako",
    title: "関西発・びわ湖ぐるり絶景プラン",
    origin: "大阪・京都",
    catchcopy: "並木・桜岬・湖上の峠道。びわ湖の名道を1日で。",
    description:
      "メタセコイア並木から海津大崎、奥琵琶湖パークウェイ、締めは比叡山ドライブウェイの夕景まで。琵琶湖の絶景ロードを巡る日帰りプラン。",
    season: "4月(桜)・5月(新緑)・11月(紅葉)が特におすすめ",
    totalKmApprox: "約250km(京都発着)",
    courseSlugs: [
      "metasequoia-namiki",
      "kaizu-osaki",
      "oku-biwako-parkway",
      "hieizan-driveway",
    ],
    schedule: [
      { time: "7:00", title: "京都を出発", note: "湖西道路で琵琶湖の西岸を北上" },
      { time: "8:30", title: "メタセコイア並木", courseSlug: "metasequoia-namiki", note: "朝の斜光が並木を抜ける時間帯がいちばん美しい。マキノピックランドに駐車" },
      { time: "9:45", title: "海津大崎の湖岸道路", courseSlug: "kaizu-osaki", note: "琵琶湖八景の岬。桜の季節は大混雑するので朝イチで" },
      { time: "11:00", title: "奥琵琶湖パークウェイ", courseSlug: "oku-biwako-parkway", note: "つづら尾崎展望台から竹生島を見下ろす" },
      { time: "12:30", title: "長浜で昼食", note: "黒壁スクエア周辺を散策。近江牛や焼鯖そうめんが名物" },
      { time: "15:30", title: "比叡山ドライブウェイへ", courseSlug: "hieizan-driveway", note: "夢見が丘展望台から、夕暮れの琵琶湖と大津市街" },
      { time: "17:30", title: "延暦寺参拝(時間があれば)", note: "世界遺産の根本中堂は16時台まで。時間と相談" },
      { time: "19:00", title: "京都・大阪へ帰着", note: "山中越えせず西大津バイパスが無難" },
    ],
    tips: [
      "桜シーズンの海津大崎は交通規制あり。事前に高島市の情報を確認",
      "びわ湖一周(ビワイチ)は約200km。今回は絶景道だけのいいとこ取り",
      "比叡山ドライブウェイは夜景営業日もある。日没時刻に合わせると最高",
    ],
  },
  {
    slug: "kyushu-aso",
    title: "熊本発・阿蘇カルデラ一周プラン",
    origin: "熊本",
    catchcopy: "世界最大級のカルデラを、外輪山と火口原から二度味わう。",
    description:
      "ミルクロードで外輪山の稜線へ、大観峰・やまなみハイウェイを経て阿蘇パノラマラインで火口原へ。阿蘇の雄大さを全身で浴びる日帰りプラン。",
    season: "4月〜11月(冬は路面凍結・野焼きの時期に注意)",
    totalKmApprox: "約180km(熊本市発着)",
    courseSlugs: ["aso-milk-road", "yamanami-highway", "aso-panorama-line"],
    schedule: [
      { time: "7:30", title: "熊本市を出発", note: "国道57号→ミルクロード方面へ" },
      { time: "8:30", title: "ミルクロードで外輪山の稜線へ", courseSlug: "aso-milk-road", note: "牧草地の中、標高900mの稜線ドライブ。放牧中の牛に注意" },
      { time: "9:30", title: "大観峰で大展望", note: "阿蘇五岳とカルデラを一望する阿蘇随一のビューポイント。朝は雲海の名所でもある" },
      { time: "11:00", title: "やまなみハイウェイを北へ", courseSlug: "yamanami-highway", note: "瀬の本高原までの草原区間はやまなみのハイライト" },
      { time: "12:00", title: "瀬の本高原で昼食", note: "三愛レストハウス周辺。あか牛丼が定番" },
      { time: "14:00", title: "阿蘇パノラマラインで火口原へ", courseSlug: "aso-panorama-line", note: "米塚・草千里ヶ浜。外輪山から見下ろした場所を今度は中から走る" },
      { time: "16:00", title: "阿蘇の温泉で締め", note: "内牧温泉が広くて入りやすい" },
      { time: "18:00", title: "熊本市へ帰着" },
    ],
    tips: [
      "火山活動により火口周辺は規制されることがある。当日の噴火警戒レベルを確認",
      "朝の大観峰の雲海は秋〜冬の放射冷却の朝が狙い目(早朝出発に変更を)",
      "高原は霧が出やすい。視界不良時はスピードを落として",
    ],
  },
  {
    slug: "tohoku-bandai",
    title: "東北発・磐梯3ライン制覇プラン",
    origin: "郡山・仙台",
    catchcopy: "スカイライン・レークライン・ゴールドライン。磐梯の名道を全部走る。",
    description:
      "磐梯吾妻スカイラインの火山景観、レークラインの湖沼、ゴールドラインの森と磐梯山。性格の違う3本の山岳道路を1日で走り比べるプラン。",
    season: "4月下旬〜11月上旬(3本とも冬季閉鎖)",
    totalKmApprox: "約220km(郡山発着)",
    courseSlugs: [
      "bandai-azuma-skyline",
      "bandai-azuma-lakeline",
      "bandai-gold-line",
    ],
    schedule: [
      { time: "7:00", title: "郡山を出発", note: "東北道→福島西ICから高湯温泉方面へ" },
      { time: "8:30", title: "磐梯吾妻スカイラインへ", courseSlug: "bandai-azuma-skyline", note: "火山荒原の中を走る非日常。浄土平で吾妻小富士に登る(往復30分)" },
      { time: "11:00", title: "磐梯吾妻レークラインへ", courseSlug: "bandai-azuma-lakeline", note: "秋元湖・小野川湖。中津川渓谷は紅葉の名所" },
      { time: "12:30", title: "裏磐梯で昼食+五色沼散策", note: "五色沼の毘沙門沼だけなら30分で往復できる" },
      { time: "14:30", title: "磐梯山ゴールドラインへ", courseSlug: "bandai-gold-line", note: "磐梯山の西腹を抜けて会津側へ。八方台からの眺めが良い" },
      { time: "16:00", title: "猪苗代湖畔で休憩", note: "天鏡閣や湖畔のカフェでひと息" },
      { time: "18:00", title: "郡山へ帰着", note: "磐越道で一気に" },
    ],
    tips: [
      "浄土平周辺は火山ガスのため駐停車禁止区間あり。窓を閉めて通過",
      "3本とも例年11月中旬〜4月中旬は冬季閉鎖。開通情報を必ず確認",
      "紅葉期(10月)は3本すべてが見頃になる年間最良のタイミング",
    ],
  },
  {
    slug: "sapporo-shakotan-niseko",
    title: "札幌発・積丹ブルーとニセコの峠",
    origin: "札幌",
    catchcopy: "海のブルーと山のパノラマ、北海道の夏を1日で。",
    description:
      "積丹ブルーロードで神威岬へ、夏はウニ丼、午後はニセコパノラマラインで羊蹄山と日本海の大観。札幌から日帰りできる北海道の贅沢プラン。",
    season: "6月〜9月(ウニ漁期は例年6〜8月)",
    totalKmApprox: "約280km(札幌発着)",
    courseSlugs: ["shakotan-blue-road", "niseko-panorama-line"],
    schedule: [
      { time: "7:00", title: "札幌を出発", note: "小樽までは高速、その先は海沿いの国道5号→229号" },
      { time: "9:00", title: "積丹ブルーロードへ", courseSlug: "shakotan-blue-road", note: "奇岩と積丹ブルーの海岸線。トンネルを抜けるたびに海の色が変わる" },
      { time: "10:00", title: "神威岬を散策", note: "駐車場から岬の先端まで徒歩往復40分。積丹ブルーの本気が見られる場所" },
      { time: "12:00", title: "積丹・美国で昼食", note: "夏限定の生ウニ丼。行列店は開店前到着が鉄則" },
      { time: "13:30", title: "ニセコパノラマラインへ南下", courseSlug: "niseko-panorama-line", note: "神仙沼の駐車場から湿原へ(徒歩往復40分)" },
      { time: "15:30", title: "羊蹄山ビューポイント", note: "倶知安の麓から望む蝦夷富士。ジャガイモ畑との組み合わせが北海道" },
      { time: "16:30", title: "京極のふきだし湧水で休憩", note: "羊蹄山の伏流水。ペットボトル持参で汲んで帰れる" },
      { time: "19:00", title: "札幌へ帰着", note: "中山峠経由で戻ると往路と景色が変わる" },
    ],
    tips: [
      "神威岬は強風時に遊歩道が閉鎖されることがある",
      "ニセコパノラマラインは例年11月〜4月冬季閉鎖",
      "夏の積丹は本州より涼しいが日差しは強い。岬歩きには帽子を",
    ],
  },
];

export function getPlanBySlug(slug: string): DrivePlan | undefined {
  return plans.find((p) => p.slug === slug);
}
