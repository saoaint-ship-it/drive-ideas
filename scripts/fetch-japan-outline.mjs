// 実際の海岸線データ(dataofjapan/land, 出典: 国土数値情報)から
// トップページ用の日本地図SVGパスを生成して data/japan-outline.ts に焼き込む。
// 一度実行すればよく、サイトの実行時には外部通信しない。
// 使い方: node scripts/fetch-japan-outline.mjs

import fs from "fs";
import path from "path";

const SRC = "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson";

// 本土用の投影: 緯度38度を基準にした正距円筒図法（横伸びを補正）
const MAIN = { lng0: 129.0, lat1: 45.8, lng1: 146.2, lat0: 30.8 };
const COS = Math.cos((38 * Math.PI) / 180);
const SCALE = 44; // px / 度
const MAIN_W = Math.round((MAIN.lng1 - MAIN.lng0) * COS * SCALE);
const MAIN_H = Math.round((MAIN.lat1 - MAIN.lat0) * SCALE);

// 沖縄インセット用の投影（沖縄本島のみ）
const OKI = { lng0: 127.5, lat1: 27.0, lng1: 128.4, lat0: 26.0 };
const OKI_COS = Math.cos((26.5 * Math.PI) / 180);
const OKI_SCALE = 60;
const OKI_W = Math.round((OKI.lng1 - OKI.lng0) * OKI_COS * OKI_SCALE);
const OKI_H = Math.round((OKI.lat1 - OKI.lat0) * OKI_SCALE);

function projMain([lng, lat]) {
  return [
    (lng - MAIN.lng0) * COS * SCALE,
    (MAIN.lat1 - lat) * SCALE,
  ];
}
function projOki([lng, lat]) {
  return [
    (lng - OKI.lng0) * OKI_COS * OKI_SCALE,
    (OKI.lat1 - lat) * OKI_SCALE,
  ];
}

// 隣接点との距離が近すぎる点を間引く（px単位）
function simplify(points, minDist) {
  const out = [points[0]];
  for (const p of points.slice(1)) {
    const last = out[out.length - 1];
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) >= minDist) out.push(p);
  }
  return out;
}

function ringToPath(ring, proj, minDist, minSize) {
  const px = simplify(ring.map(proj), minDist);
  if (px.length < 8) return null;
  const xs = px.map((p) => p[0]);
  const ys = px.map((p) => p[1]);
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  if (w < minSize && h < minSize) return null; // 小さすぎる島は省略
  return (
    "M" +
    px.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") +
    "Z"
  );
}

function centroidOf(ring) {
  let sx = 0;
  let sy = 0;
  for (const [lng, lat] of ring) {
    sx += lng;
    sy += lat;
  }
  return [sx / ring.length, sy / ring.length];
}

console.log("downloading japan.geojson ...");
const res = await fetch(SRC);
if (!res.ok) throw new Error(`download failed: ${res.status}`);
const geo = await res.json();

const mainPaths = [];
const okiPaths = [];

for (const feature of geo.features) {
  const g = feature.geometry;
  const polys =
    g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  for (const poly of polys) {
    const outer = poly[0]; // 外周のみ（湖などの穴は無視）
    const [clng, clat] = centroidOf(outer);
    if (clng >= MAIN.lng0 && clng <= MAIN.lng1 && clat >= MAIN.lat0 && clat <= MAIN.lat1) {
      const d = ringToPath(outer, projMain, 1.6, 6);
      if (d) mainPaths.push(d);
    } else if (clng >= OKI.lng0 && clng <= OKI.lng1 && clat >= OKI.lat0 && clat <= OKI.lat1) {
      const d = ringToPath(outer, projOki, 1.2, 5);
      if (d) okiPaths.push(d);
    }
  }
}

const banner = `// このファイルは scripts/fetch-japan-outline.mjs が自動生成する。手で編集しない。
// 出典: dataofjapan/land (国土数値情報を元にしたGeoJSON)
`;

const body = `${banner}
export const MAIN_VIEW = { w: ${MAIN_W}, h: ${MAIN_H} };
export const OKI_VIEW = { w: ${OKI_W}, h: ${OKI_H} };

// 経緯度→本土図のpx座標
export function projectMain(lng: number, lat: number): [number, number] {
  return [
    (lng - ${MAIN.lng0}) * ${COS.toFixed(6)} * ${SCALE},
    (${MAIN.lat1} - lat) * ${SCALE},
  ];
}

// 経緯度→沖縄インセットのpx座標
export function projectOki(lng: number, lat: number): [number, number] {
  return [
    (lng - ${OKI.lng0}) * ${OKI_COS.toFixed(6)} * ${OKI_SCALE},
    (${OKI.lat1} - lat) * ${OKI_SCALE},
  ];
}

export const mainlandPaths: string[] = ${JSON.stringify(mainPaths)};

export const okinawaPaths: string[] = ${JSON.stringify(okiPaths)};
`;

const dest = path.join(process.cwd(), "data", "japan-outline.ts");
fs.writeFileSync(dest, body);
const kb = Math.round(fs.statSync(dest).size / 1024);
console.log(
  `wrote data/japan-outline.ts (${kb} KB, main ${mainPaths.length} paths, okinawa ${okiPaths.length} paths)`
);
