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
  {
    slug: "kure-tobishima-noro",
    title: "呉発・とびしま海道と瀬戸内の空",
    origin: "広島県呉市",
    catchcopy: "橋で島へ渡り、山頂から海を見下ろす。呉発の半日贅沢コース。",
    description:
      "安芸灘大橋から始まる7つの橋の島旅・とびしま海道を走り抜け、締めは野呂山さざなみスカイラインで瀬戸内の多島美を見下ろす。呉から半日〜1日で完結する瀬戸内欲張りプラン。",
    season: "3月〜11月(みかんの花咲く5月・収穫期の秋も彩り豊か)",
    totalKmApprox: "約90km(呉発着)",
    courseSlugs: ["akinada-tobishima", "norosan-sazanami"],
    schedule: [
      { time: "8:00", title: "呉市街を出発", note: "国道185号で川尻・安浦方面へ" },
      { time: "8:40", title: "安芸灘大橋を渡る", courseSlug: "akinada-tobishima", note: "とびしま海道の起点。ここだけ有料、以降の橋は無料" },
      { time: "9:30", title: "御手洗地区(大崎下島)を散策", note: "江戸〜明治の港町の面影。北前船で栄えた町並みを歩く" },
      { time: "10:30", title: "岡村大橋で広島・愛媛またぎ", note: "橋の途中に県境。折り返して呉方面へ戻る" },
      { time: "12:00", title: "川尻でお好み焼き昼食", note: "とびしま海道の起点でもある港町。地元の食堂が狙い目" },
      { time: "13:00", title: "野呂山さざなみスカイラインへ", courseSlug: "norosan-sazanami", note: "急なつづら折りを一気に登り、標高750mの山頂展望台へ" },
      { time: "14:00", title: "野呂山山頂で瀬戸内を一望", note: "先ほど走った安芸灘の島々と橋を、今度は上から見下ろす" },
      { time: "15:30", title: "呉へ帰着", note: "時間があれば大和ミュージアムや呉市街の散策も" },
    ],
    tips: [
      "安芸灘大橋のみ有料。ETCが使えない場合は現金の用意を",
      "御手洗地区は道が狭い。散策は徒歩で、車は指定駐車場に",
      "野呂山は霧が出やすい。視界不良時は無理をしない",
    ],
  },
  {
    slug: "matsuyama-shikoku-sky",
    title: "松山発・四国天空ロード制覇プラン",
    origin: "愛媛県松山市",
    catchcopy: "エメラルドの渓谷から、雲の上の稜線へ。",
    description:
      "面河渓の清流から石鎚スカイラインで一気に標高1,500mへ、そのまま稜線続きのUFOラインへと走り継ぐ、四国山地のハイライトを1日で味わうプラン。西日本最高峰・石鎚山の懐を巡る。",
    season: "5月〜10月(石鎚スカイラインは例年11月下旬〜4月上旬冬季閉鎖)",
    totalKmApprox: "約180km(松山発着)",
    courseSlugs: ["ishizuchi-skyline", "ufo-line"],
    schedule: [
      { time: "6:30", title: "松山を出発", note: "国道33号・492号で久万高原・面河方面へ" },
      { time: "8:00", title: "面河渓を散策", note: "エメラルド色の渓谷。石鎚スカイラインの登り口として一息つく" },
      { time: "8:30", title: "石鎚スカイラインを登る", courseSlug: "ishizuchi-skyline", note: "標高差1,000m超。森林限界を越えると視界が一気にひらける" },
      { time: "9:30", title: "土小屋で休憩", note: "標高約1,500m。石鎚山登山口。天気が良ければ稜線が一望できる" },
      { time: "10:00", title: "UFOライン(瓶ヶ森林道)へ", courseSlug: "ufo-line", note: "土小屋から続く稜線ドライブ。雲の上を走るような開放感" },
      { time: "11:30", title: "瓶ヶ森で稜線散策", note: "駐車場から瓶ヶ森山頂まで徒歩30分ほど。四国山地の大パノラマ" },
      { time: "13:00", title: "寒風山方面へ抜けて下山", note: "西条方面に下りると、また違う四国の山並みが見える" },
      { time: "14:30", title: "西条で昼食・給油", note: "山中はガソリンスタンドがほぼ無い。この先の給油はここで" },
      { time: "17:00", title: "松山へ帰着", note: "松山道を使えば夕方の渋滞も回避しやすい" },
    ],
    tips: [
      "石鎚スカイラインは冬季閉鎖・夜間通行止めあり。事前に開通状況を確認",
      "土小屋〜瓶ヶ森間は山中でガソリンスタンド・コンビニが無い。西条側で満タンにしておく",
      "標高差が大きく天候が急変しやすい。晴れていても上着を1枚",
    ],
  },
  {
    slug: "nagoya-seseragi-shirakawago",
    title: "名古屋発・郡上せせらぎと白川郷ホワイトロード",
    origin: "愛知県名古屋市",
    catchcopy: "清流の街道を抜け、世界遺産の里へ。",
    description:
      "水の城下町・郡上八幡から国道472号(せせらぎ街道)を北上、白川郷を経て白山白川郷ホワイトロードの断崖ドライブへ。清流と世界遺産、そして山岳道路を一日で巡る欲張りな長距離プラン。",
    season: "5月〜10月(ホワイトロードは例年11月上旬〜6月上旬冬季閉鎖)",
    totalKmApprox: "約380km(名古屋発着)",
    courseSlugs: ["seseragi-kaido", "hakusan-shirakawago"],
    schedule: [
      { time: "6:00", title: "名古屋を出発", note: "東海北陸道で郡上八幡ICへ。朝のうちに距離を稼ぐ" },
      { time: "7:30", title: "郡上八幡で朝の町歩き", note: "水の城下町。宗祇水など湧水スポットが点在" },
      { time: "8:00", title: "せせらぎ街道を北上", courseSlug: "seseragi-kaido", note: "吉田川・馬瀬川に沿って走る国道472号。標高206mから一気に登る" },
      { time: "9:30", title: "西ウレ峠で休憩", note: "街道の最高地点、標高1,128m。紅葉期はここが特に美しい" },
      { time: "11:00", title: "白川郷に到着・散策", note: "世界遺産の合掌造り集落。展望台からの俯瞰がおすすめ" },
      { time: "13:00", title: "白川郷で昼食", note: "飛騨牛や五平餅など。集落内の食事処は早めの時間が空いている" },
      { time: "14:00", title: "白山白川郷ホワイトロードへ", courseSlug: "hakusan-shirakawago", note: "断崖沿いの有料道路。ふくべの大滝・三方岩岳の展望が見どころ" },
      { time: "16:00", title: "石川県側(白山ICへ)抜け", note: "そのまま北陸道経由で帰るか、白川郷側に戻るか選べる" },
      { time: "20:00", title: "名古屋へ帰着", note: "長距離になるため、休憩をこまめに挟む計画で" },
    ],
    tips: [
      "白山白川郷ホワイトロードは有料・冬季閉鎖(例年11月上旬〜6月上旬)あり",
      "移動距離が長い一日になる。早朝出発と余裕あるスケジュールが必須",
      "郡上八幡・白川郷ともに観光地。駐車場は午前中の到着が安心",
    ],
  },
  {
    slug: "yonago-daisen-nakaumi",
    title: "米子・松江発・大山と中海の絶景めぐり",
    origin: "鳥取県米子市・島根県松江市",
    catchcopy: "伯耆富士の懐から、湖を渡ってベタ踏み坂へ。",
    description:
      "大山環状道路で鍵掛峠から大山南壁を望み、中海堤防道路で湖の上を渡ってCMで話題になった江島大橋(ベタ踏み坂)へ。米子・松江エリアの個性的な絶景を半日で巡るプラン。",
    season: "通年(大山環状道路は積雪期に道路状況の確認を)",
    totalKmApprox: "約100km(米子発着)",
    courseSlugs: ["daisen-kanjo", "nakaumi-teibo"],
    schedule: [
      { time: "8:30", title: "米子を出発", note: "国道180号・伯耆街道で大山寺方面へ" },
      { time: "9:15", title: "大山寺エリアに到着", note: "大山信仰の拠点。宿坊や飲食店が集まる登り口" },
      { time: "9:30", title: "大山環状道路を走る", courseSlug: "daisen-kanjo", note: "ブナ林の中を鍵掛峠へ。標高差500m超のワインディング" },
      { time: "10:00", title: "鍵掛峠展望台で大山南壁を望む", note: "西の伯耆富士とは対照的な、荒々しい南壁の岩肌が正面に" },
      { time: "10:30", title: "御机の茅葺小屋で撮影休憩", note: "茅葺屋根と大山を組み合わせた定番の一枚" },
      { time: "12:00", title: "米子に戻り昼食", note: "境港方面へ抜ける前に腹ごしらえ" },
      { time: "13:30", title: "中海堤防道路を渡る", courseSlug: "nakaumi-teibo", note: "水面すれすれの堤防道路。湖の上を一直線に走る独特の開放感" },
      { time: "14:15", title: "大根島(八束町)に立ち寄り", note: "牡丹と高麗人参で知られる中海に浮かぶ島" },
      { time: "14:45", title: "江島大橋(ベタ踏み坂)を渡る", note: "CMで話題になった急勾配の橋。境港側から見上げる姿が圧巻" },
      { time: "16:00", title: "松江・米子へ帰着", note: "境港で海鮮を買って帰るのもおすすめ" },
    ],
    tips: [
      "大山環状道路は冬季積雪あり。12月〜3月は道路状況を事前確認",
      "堤防道路・橋は横風が強い日がある。ハンドルをしっかり握る",
      "ベタ踏み坂の撮影は境港側の駐車場から。路上駐車は避ける",
    ],
  },
];

export function getPlanBySlug(slug: string): DrivePlan | undefined {
  return plans.find((p) => p.slug === slug);
}
