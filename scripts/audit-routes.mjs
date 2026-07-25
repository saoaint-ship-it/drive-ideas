// 全コースのルートを一括点検する。
// 「保存済みのルートラインが、本当にその名前の道の上を通っているか」を機械的に確かめる。
//
// 過去に見つかった誤りのパターン:
//   - 有料道路(伊勢志摩スカイライン)→ 経路計算が無料の谷道へ逃げていた
//   - 砂浜の道(千里浜なぎさドライブウェイ)→ 内陸の一般道を走っていた
//   - 登坂路(富士山スカイライン)→ 周遊区間だけで山頂側が入っていなかった
//
// 検査内容:
//   1. 道路名  : ルート上の各点が実際に乗っている道路名(OSRM match)を取得し、
//                コース名の主要語と突き合わせる
//   2. 標高    : ルート上の標高(ASTER GDEM)の最大値と、登録済み maxElevationM を比較
//   3. 距離    : ルートラインの実長と、登録済み distanceKm を比較
//   4. 有料道路: toll:"有料" のコースは通過道路名を必ず目視できるよう出力する
//
// 実行: node scripts/audit-routes.mjs [slug ...]
//   引数にslugを与えるとそのコースだけを点検する(新規追加時のダブルチェック用)。

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const UA = { "User-Agent": "drive-ideas-route-audit/1.0" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- データ読み込み -------------------------------------------------
let pathsSrc = readFileSync(path.join(root, "data/paths.ts"), "utf8");
pathsSrc = pathsSrc.replace(/^\s*\/\/.*$/gm, "");
pathsSrc = pathsSrc.replace(/export const routePaths[^=]*=/, "return ");
const routePaths = new Function(pathsSrc)();

// data配下の courses*.ts を自動で全部拾う（ファイルが増えても取りこぼさない）
import { readdirSync } from "fs";
const files = readdirSync(path.join(root, "data"))
  .filter((f) => /^courses.*\.ts$/.test(f))
  .map((f) => `data/${f}`);
const courses = [];
for (const f of files) {
  const t = readFileSync(path.join(root, f), "utf8");
  for (const b of t.split(/(?=slug: ")/g)) {
    const slug = b.match(/^slug: "([a-z0-9-]+)"/)?.[1];
    if (!slug) continue;
    courses.push({
      slug,
      name: b.match(/name: "([^"]+)"/)?.[1] ?? "",
      distanceKm: Number(b.match(/distanceKm: ([\d.]+)/)?.[1]),
      maxElevationM: Number(b.match(/maxElevationM: ([\d.]+)/)?.[1]),
      toll: b.match(/toll: "([^"]+)"/)?.[1] ?? "",
    });
  }
}

// --- ユーティリティ -------------------------------------------------
const R = 6371000;
function haversine(a, b) {
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const la1 = (a[1] * Math.PI) / 180;
  const la2 = (b[1] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function pathLengthKm(p) {
  let d = 0;
  for (let i = 1; i < p.length; i++) d += haversine(p[i - 1], p[i]);
  return d / 1000;
}
function sample(p, n) {
  return Array.from({ length: n }, (_, i) =>
    p[Math.round((i * (p.length - 1)) / (n - 1))]
  );
}

// コース名から、道路名と突き合わせる主要語を取り出す
// 例: "伊勢志摩スカイライン" -> ["伊勢志摩スカイライン","伊勢志摩"]
//     "国道249号 奥能登海岸（輪島〜珠洲）" -> ["国道249号","奥能登海岸"]
function nameTokens(name) {
  const base = name.replace(/[（(].*?[)）]/g, " ");
  const parts = base.split(/[\s・/／、]+/).filter((s) => s.length >= 2);
  const out = new Set(parts);
  for (const p of parts) {
    const m = p.match(/^(.+?)(スカイライン|ドライブウェイ|ライン|パークウェイ|road|ロード)$/i);
    if (m && m[1].length >= 2) out.add(m[1]);
  }
  return [...out];
}

// --- 外部API --------------------------------------------------------
// ルートライン上の点が実際に乗っている道路名を、OSRMのnearest(最寄りの道へのスナップ)で調べる。
// 「線が正しい道の上に乗っているか」を直接確かめられるので、経路の再計算より確実。
// 戻り値: [[道路名, 出現点数], ...] と、スナップ距離が遠かった点の数
const SNAP_POINTS = 10;
async function snappedRoadNames(p) {
  const pts = sample(p, Math.min(SNAP_POINTS, p.length));
  const count = new Map();
  let farPoints = 0;
  for (const [lng, lat] of pts) {
    const res = await fetch(
      `https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}?number=1`,
      { headers: UA }
    );
    const j = await res.json();
    const w = j.waypoints?.[0];
    const nm = w ? w.name || "(名称なし)" : "(取得失敗)";
    count.set(nm, (count.get(nm) ?? 0) + 1);
    if (w && w.distance > 60) farPoints++;
    await sleep(900);
  }
  return {
    roads: [...count.entries()].sort((a, b) => b[1] - a[1]),
    farPoints,
    total: pts.length,
  };
}

async function maxElevation(p) {
  const pts = sample(p, Math.min(60, p.length));
  const locs = pts.map(([lng, lat]) => `${lat},${lng}`).join("|");
  const res = await fetch(
    `https://api.opentopodata.org/v1/aster30m?locations=${locs}`
  );
  const j = await res.json();
  if (j.status !== "OK") return null;
  return Math.max(...j.results.map((r) => Math.round(r.elevation)));
}

// --- 実行 -----------------------------------------------------------
const only = process.argv.slice(2);
const target = courses.filter(
  (c) => routePaths[c.slug] && (only.length === 0 || only.includes(c.slug))
);
console.log(`点検対象: ${target.length}コース\n`);

const findings = [];
for (let i = 0; i < target.length; i++) {
  const c = target[i];
  const p = routePaths[c.slug];
  const flags = [];

  const lenKm = pathLengthKm(p);
  if (c.distanceKm && Math.abs(lenKm - c.distanceKm) / c.distanceKm > 0.2)
    flags.push(
      `距離ズレ: 登録${c.distanceKm}km / 実測${lenKm.toFixed(1)}km`
    );

  let snap = null;
  try {
    snap = await snappedRoadNames(p);
  } catch (e) {
    flags.push(`道路名取得エラー: ${e.message}`);
  }

  if (snap) {
    const joined = snap.roads.map(([n]) => n).join(" ");
    const tokens = nameTokens(c.name);
    if (!tokens.some((t) => joined.includes(t)))
      flags.push("道路名にコース名が出てこない");
    if (snap.farPoints > 0)
      flags.push(`道から離れた点が${snap.farPoints}/${snap.total}点`);
    if (c.toll === "有料") flags.push("有料道路(通過道路の目視確認が必要)");
  }

  let elev = null;
  try {
    elev = await maxElevation(p);
  } catch {
    /* 標高は取れなくても致命的ではない */
  }
  await sleep(1600);
  if (elev !== null && Number.isFinite(c.maxElevationM)) {
    const diff = Math.abs(elev - c.maxElevationM);
    if (diff > Math.max(80, c.maxElevationM * 0.25))
      flags.push(`標高ズレ: 登録${c.maxElevationM}m / 実測${elev}m`);
  }

  const top = snap
    ? snap.roads.slice(0, 4).map(([n, k]) => `${n}×${k}`).join(" / ")
    : "取得失敗";
  const mark = flags.length ? "!!" : "ok";
  console.log(
    `[${i + 1}/${target.length}] ${mark} ${c.slug} ${c.name}\n     道路: ${top}`
  );
  if (flags.length) {
    for (const f of flags) console.log(`     - ${f}`);
    findings.push({ slug: c.slug, name: c.name, flags, roads: top });
  }
}

console.log(`\n===== 要確認 ${findings.length}件 =====`);
for (const f of findings) {
  console.log(`\n● ${f.slug}  ${f.name}`);
  console.log(`  道路: ${f.roads}`);
  for (const x of f.flags) console.log(`  - ${x}`);
}
