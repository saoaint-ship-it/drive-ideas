// 実際の道路に沿ったルートラインを OSRM(無料の経路計算サービス) から一度だけ取得し、
// data/paths.ts に焼き込むスクリプト。サイトの表示時には外部通信しない。
// 実行: node scripts/fetch-routes.mjs
import { writeFileSync } from "fs";

// 各コースの経由地 [lng, lat]
const WAYPOINTS = {
  "sky-road-shari": [
    [144.9714, 44.0762], // スタート地点展望所
    [144.6641, 43.9106], // 道の駅しゃり
  ],
  irohazaka: [
    [139.5568, 36.7345], // 馬返し
    [139.5216, 36.7404], // 明智平
    [139.4988, 36.7327], // 中禅寺湖畔
  ],
  "venus-line": [
    [138.205, 35.995], // 茅野側
    [138.146, 36.115], // 白樺湖
    [138.196, 36.106], // 霧ヶ峰
    [138.093, 36.222], // 道の駅美ヶ原高原
  ],
  "metasequoia-namiki": [
    [136.0437, 35.4623], // 並木南端
    [136.0537, 35.4838], // 並木北端
  ],
  "tsunoshima-ohashi": [
    [130.904, 34.333], // 本土側
    [130.8935, 34.3405], // 海士ヶ瀬公園
    [130.868, 34.357], // ビーチ
    [130.8446, 34.3688], // 角島灯台
  ],
  "aso-panorama-line": [
    [131.064, 32.943], // 坊中側
    [131.0292, 32.9147], // 米塚
    [131.0405, 32.8858], // 草千里
    [131.078, 32.8845], // 阿蘇山上
  ],
  "bandai-azuma-skyline": [
    [140.3865, 37.7955], // 高湯温泉側ゲート
    [140.2528, 37.7185], // 浄土平
    [140.2653, 37.6789], // 土湯峠側
  ],
  "hachimantai-aspite-line": [
    [141.014, 39.943], // 八幡平温泉郷(岩手側)
    [140.8542, 39.9548], // 八幡平山頂レストハウス
    [140.768, 39.96], // 秋田側
  ],
  "izu-skyline": [
    [139.0355, 35.0885], // 熱海峠IC
    [139.048, 35.008], // 亀石峠IC
    [139.0399, 34.8963], // 天城高原IC
  ],
  "hakone-turnpike": [
    [139.1237, 35.2445], // 小田原料金所
    [139.0261, 35.2043], // 大観山
  ],
  "shimanami-kaido": [
    [133.2075, 34.3934], // 尾道側
    [133.077, 34.286], // 生口島
    [132.998, 34.093], // 今治IC
  ],
  "ufo-line": [
    [133.2712, 33.8542], // 寒風山トンネル西口
    [133.2258, 33.8067], // 瓶ヶ森
    [133.1425, 33.7789], // 土小屋
  ],
  // ---- 追加38コース ----
  "shiretoko-odan": [
    [144.982, 44.067], // ウトロ
    [145.07, 44.073], // 知床峠
    [145.187, 44.021], // 羅臼
  ],
  "biei-patchwork": [
    [142.467, 43.588], // 美瑛駅
    [142.437, 43.605], // 北西の丘
    [142.403, 43.633], // セブンスターの木方面
  ],
  "naitai-kogen": [
    [143.294, 43.231], // 上士幌市街
    [143.17, 43.33], // ナイタイ高原牧場
  ],
  "ororon-line": [
    [141.43, 43.39], // 石狩・厚田
    [141.4, 43.62], // 浜益
    [141.523, 43.856], // 増毛
  ],
  "shakotan-blue-road": [
    [140.79, 43.19], // 余市
    [140.63, 43.27], // 古平
    [140.35, 43.33], // 神威岬
  ],
  "zao-echo-line": [
    [140.6, 38.07], // 遠刈田温泉
    [140.44, 38.12], // 刈田峠
  ],
  "chokai-blue-line": [
    [139.906, 39.203], // 象潟
    [139.97, 39.12], // 鉾立展望台
    [139.92, 39.08], // 吹浦
  ],
  "towada-oirase": [
    [140.977, 40.548], // 焼山
    [140.929, 40.47], // 子ノ口
    [140.895, 40.428], // 休屋
  ],
  "bandai-gold-line": [
    [140.02, 37.56], // 磐梯町側
    [140.063, 37.627], // 八方台
    [140.07, 37.66], // 桧原湖
  ],
  "kusatsu-shiga": [
    [138.596, 36.62], // 草津温泉
    [138.518, 36.682], // 渋峠
    [138.48, 36.7], // 志賀高原側
  ],
  "akagi-nanmen": [
    [139.1, 36.46], // 前橋側
    [139.183, 36.543], // 赤城山大沼
  ],
  "boso-flower-line": [
    [139.83, 34.98], // 館山市街
    [139.75, 34.97], // 洲崎
    [139.89, 34.9], // 野島崎
  ],
  "okutama-shuyu": [
    [139.03, 35.73], // 数馬(都民の森側)
    [139.049, 35.784], // 奥多摩湖側
  ],
  "tsukuba-purple-line": [
    [140.09, 36.16], // 不動峠側
    [140.11, 36.22], // つつじヶ丘
  ],
  "hakusan-shirakawago": [
    [136.9, 36.27], // 白川郷側
    [136.83, 36.285], // 三方岩駐車場
    [136.77, 36.27], // ふくべの大滝
    [136.7, 36.26], // 中宮側
  ],
  "chirihama-nagisa": [
    [136.785, 36.865], // 千里浜IC側
    [136.77, 36.828], // 今浜側
  ],
  "nishi-izu-skyline": [
    [138.79, 34.97], // 戸田峠
    [138.81, 34.92], // 船原峠
  ],
  "fujisan-skyline": [
    [138.62, 35.28], // 富士宮側
    [138.769, 35.239], // 水ヶ塚公園
  ],
  "kaida-kogen": [
    [137.69, 35.84], // 木曽福島
    [137.58, 35.94], // 開田高原
  ],
  "chausuyama-kogen": [
    [137.6, 35.2], // 面ノ木側
    [137.658, 35.222], // 茶臼山高原
  ],
  "yatsugatake-echo-line": [
    [138.22, 35.97], // 原村
    [138.24, 35.92], // 富士見
  ],
  "mikatagoko-rainbow-line": [
    [135.9, 35.55], // 三方五湖入口
    [135.86, 35.6], // 山頂公園側
  ],
  "koya-ryujin-skyline": [
    [135.59, 34.21], // 高野山
    [135.57, 34.06], // 護摩壇山
    [135.55, 33.99], // 龍神温泉
  ],
  "ise-shima-skyline": [
    [136.73, 34.45], // 伊勢側
    [136.82, 34.47], // 鳥羽側
  ],
  "oku-biwako-parkway": [
    [136.09, 35.44], // 海津大崎
    [136.14, 35.44], // つづら尾崎展望台
  ],
  "rokko-drive": [
    [135.33, 34.8], // 宝塚側
    [135.253, 34.767], // 六甲ガーデンテラス
    [135.23, 34.77], // 記念碑台
  ],
  "tango-peninsula": [
    [135.19, 35.57], // 天橋立
    [135.28, 35.67], // 伊根
    [135.22, 35.78], // 経ヶ岬
  ],
  "akiyoshidai-karst-road": [
    [131.3, 34.23], // 秋芳洞側
    [131.34, 34.27], // 美東側
  ],
  "hiruzen-daisen-skyline": [
    [133.65, 35.29], // 蒜山高原
    [133.6, 35.32], // 鬼女台
    [133.52, 35.37], // 桝水高原
  ],
  "washuzan-skyline": [
    [133.75, 34.52], // 水島側
    [133.81, 34.45], // 鷲羽山側
  ],
  "shikoku-karst": [
    [132.86, 33.47], // 大野ヶ原
    [132.92, 33.49], // 姫鶴平
    [132.97, 33.51], // 天狗高原
  ],
  "yokonami-kuroshio-line": [
    [133.45, 33.44], // 宇佐大橋
    [133.35, 33.41], // 五色ノ浜
    [133.29, 33.39], // 須崎
  ],
  "sadamisaki-melody-line": [
    [132.35, 33.49], // 伊方
    [132.13, 33.39], // 三崎港
  ],
  "yamanami-highway": [
    [131.35, 33.26], // 湯布院
    [131.24, 33.08], // 長者原
    [131.12, 32.97], // 阿蘇一の宮
  ],
  "ibusuki-skyline": [
    [130.49, 31.51], // 谷山
    [130.52, 31.3], // 頴娃・池田湖側
  ],
  "amakusa-pearl-line": [
    [130.467, 32.518], // 三角
    [130.37, 32.52], // 松島
  ],
  "kaichu-doro": [
    [127.928, 26.33], // 与那城側
    [127.99, 26.36], // 宮城島
    [128.0, 26.387], // 伊計島
  ],
  "niraikanai-bridge": [
    [127.77, 26.155], // つきしろ側
    [127.79, 26.14], // 国道331合流側
  ],
};

const MAX_POINTS = 200;

function downsample(coords) {
  if (coords.length <= MAX_POINTS) return coords;
  const step = (coords.length - 1) / (MAX_POINTS - 1);
  const out = [];
  for (let i = 0; i < MAX_POINTS; i++) {
    out.push(coords[Math.round(i * step)]);
  }
  return out;
}

async function fetchRoute(slug, waypoints) {
  const coordsStr = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?geometries=geojson&overview=full`;
  const res = await fetch(url, {
    headers: { "User-Agent": "drive-ideas-prototype (one-time route bake)" },
  });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== "Ok") throw new Error(`${slug}: ${json.code}`);
  const route = json.routes[0];
  const coords = downsample(route.geometry.coordinates).map(([lng, lat]) => [
    Number(lng.toFixed(5)),
    Number(lat.toFixed(5)),
  ]);
  console.log(
    `${slug}: ${coords.length} pts, ${(route.distance / 1000).toFixed(1)} km`
  );
  return coords;
}

const result = {};
for (const [slug, waypoints] of Object.entries(WAYPOINTS)) {
  result[slug] = await fetchRoute(slug, waypoints);
  await new Promise((r) => setTimeout(r, 1200)); // 連続アクセスを避ける
}

const banner = `// このファイルは scripts/fetch-routes.mjs が自動生成したものです。
// 実際の道路に沿ったルートライン([lng, lat]の配列)。手で編集しないこと。
export const routePaths: Record<string, [number, number][]> = `;

writeFileSync(
  new URL("../data/paths.ts", import.meta.url),
  banner + JSON.stringify(result, null, 1) + ";\n"
);
console.log("data/paths.ts written");
