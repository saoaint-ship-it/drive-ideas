// ルート形状(data/paths.ts)と標高プロファイルから、各コースの
// ヘアピン数・カーブ数・最大勾配を自動計算して data/roadStats.ts に焼き込む。
// 実行: node scripts/compute-road-stats.mjs
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// --- paths.ts を読み込む(純データなのでevalで取り出す) ---
let pathsSrc = readFileSync(path.join(root, "data/paths.ts"), "utf8");
pathsSrc = pathsSrc.replace(/^\s*\/\/.*$/gm, "");
pathsSrc = pathsSrc.replace(/export const routePaths[^=]*=/, "return ");
const routePaths = new Function(pathsSrc)();

// --- コースデータから slug / distanceKm / elevationProfile を抽出 ---
const files = [
  "data/courses.ts",
  "data/courses-extra.ts",
  "data/courses-extra2.ts",
  "data/courses-extra3.ts",
  "data/courses-extra4.ts",
  "data/courses-extra5.ts",
  "data/courses-extra6.ts",
];
const courses = [];
for (const f of files) {
  const t = readFileSync(path.join(root, f), "utf8");
  const blocks = t.split(/(?=slug: ")/g);
  for (const b of blocks) {
    const slug = b.match(/^slug: "([a-z0-9-]+)"/)?.[1];
    if (!slug) continue;
    const distanceKm = Number(b.match(/distanceKm: ([\d.]+)/)?.[1]);
    const profRaw = b.match(/elevationProfile: \[([^\]]+)\]/)?.[1];
    const elevationProfile = profRaw
      ? profRaw.split(",").map((s) => Number(s.trim()))
      : null;
    courses.push({ slug, distanceKm, elevationProfile });
  }
}

// --- 幾何ユーティリティ ---
const R = 6371000;
function dist(a, b) {
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
function heading(a, b) {
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180) / Math.PI;
}
function normDeg(d) {
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

// 経路を約30m間隔にリサンプリング
function resample(coords, stepM = 30) {
  const out = [coords[0]];
  let acc = 0;
  for (let i = 1; i < coords.length; i++) {
    let d = dist(coords[i - 1], coords[i]);
    let from = coords[i - 1];
    while (acc + d >= stepM) {
      const t = (stepM - acc) / d;
      const p = [
        from[0] + (coords[i][0] - from[0]) * t,
        from[1] + (coords[i][1] - from[1]) * t,
      ];
      out.push(p);
      d -= stepM - acc;
      acc = 0;
      from = p;
    }
    acc += d;
  }
  return out;
}

// カーブ検出: 各ステップの方位変化を計算し、
// スライディングウィンドウの累積回転量で判定する。
function analyzeCurves(coords) {
  const pts = resample(coords, 30);
  if (pts.length < 4) return { hairpins: 0, corners: 0 };
  const turns = [];
  for (let i = 1; i < pts.length - 1; i++) {
    const h1 = heading(pts[i - 1], pts[i]);
    const h2 = heading(pts[i], pts[i + 1]);
    turns.push(normDeg(h2 - h1));
  }
  // ウィンドウ内(約180m=6ステップ)の同方向累積回転
  const W = 6;
  let hairpins = 0;
  let corners = 0;
  let i = 0;
  while (i < turns.length) {
    let cum = 0;
    let maxCum = 0;
    for (let j = i; j < Math.min(i + W, turns.length); j++) {
      cum += turns[j];
      if (Math.abs(cum) > Math.abs(maxCum)) maxCum = cum;
    }
    const a = Math.abs(maxCum);
    if (a >= 150) {
      hairpins++;
      corners++;
      i += W; // 二重カウント防止
    } else if (a >= 60) {
      corners++;
      i += W;
    } else {
      i++;
    }
  }
  return { hairpins, corners };
}

// 最大勾配: 標高プロファイル(等間隔サンプル)の隣接差から算出
function maxGradient(distanceKm, profile) {
  if (!profile || profile.length < 2 || !distanceKm) return null;
  const segM = (distanceKm * 1000) / (profile.length - 1);
  let max = 0;
  for (let i = 1; i < profile.length; i++) {
    const g = (Math.abs(profile[i] - profile[i - 1]) / segM) * 100;
    if (g > max) max = g;
  }
  return Math.round(max * 10) / 10;
}

// --- 全コースを計算 ---
const stats = {};
for (const c of courses) {
  const coords = routePaths[c.slug];
  if (!coords || coords.length < 3) {
    console.warn("skip (no path):", c.slug);
    continue;
  }
  const { hairpins, corners } = analyzeCurves(coords);
  const grad = maxGradient(c.distanceKm, c.elevationProfile);
  stats[c.slug] = {
    hairpins,
    corners,
    maxGradientPct: grad,
  };
  console.log(
    c.slug.padEnd(28),
    "hairpins:" + String(hairpins).padStart(3),
    "corners:" + String(corners).padStart(4),
    "maxGrad:" + (grad ?? "-") + "%"
  );
}

const banner = `// このファイルは scripts/compute-road-stats.mjs が自動生成したものです。
// ルート形状(paths.ts)と標高プロファイルから計算した道のデータ。手で編集しないこと。
// hairpins: ヘアピンカーブ数(累積回転150°以上) / corners: カーブ数(60°以上、ヘアピン含む)
// maxGradientPct: 最大勾配の目安(%)。標高サンプル間の平均勾配のため実際の瞬間勾配より小さめに出る。

export type RoadStats = {
  hairpins: number;
  corners: number;
  maxGradientPct: number | null;
};

export const roadStats: Record<string, RoadStats> = `;

writeFileSync(
  path.join(root, "data/roadStats.ts"),
  banner + JSON.stringify(stats, null, 1) + ";\n"
);
console.log("\ndata/roadStats.ts written:", Object.keys(stats).length, "courses");
