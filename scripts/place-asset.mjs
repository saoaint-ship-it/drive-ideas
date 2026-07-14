// ダウンロードした素材をWeb用に圧縮してサイトの枠に配置するスクリプト
// 使い方: node scripts/place-asset.mjs <元ファイル> <public配下のパス>
// 例: node scripts/place-asset.mjs C:/Users/saoai/Downloads/12345_m.jpg /images/courses/shiretoko-odan/hero.jpg
import sharp from "sharp";
import fs from "fs";
import path from "path";

const [src, dest] = process.argv.slice(2);
if (!src || !dest) {
  console.error("usage: node scripts/place-asset.mjs <srcFile> <publicPath>");
  process.exit(1);
}

const abs = path.join(process.cwd(), "public", dest);
fs.mkdirSync(path.dirname(abs), { recursive: true });

const out = await sharp(src)
  .rotate()
  .resize({ width: 2400, withoutEnlargement: true })
  .jpeg({ quality: 84 })
  .toBuffer();
fs.writeFileSync(abs, out);
console.log(`placed: ${dest} (${Math.round(out.length / 1024)} KB)`);
