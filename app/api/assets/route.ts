import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAssetSlots } from "@/lib/assetSlots";

// 素材管理画面(/admin)用のAPI。ローカル開発専用。
// 台帳(lib/assetSlots.ts)にあるパス以外への書き込みは拒否する

const PUBLIC_DIR = path.join(process.cwd(), "public");

function slotByPath(slotPath: string) {
  return getAssetSlots().find((s) => s.path === slotPath);
}

function absPath(slotPath: string) {
  const p = path.join(PUBLIC_DIR, slotPath);
  if (!p.startsWith(PUBLIC_DIR)) throw new Error("invalid path");
  return p;
}

export async function GET() {
  const slots = getAssetSlots().map((slot) => {
    const abs = absPath(slot.path);
    let exists = false;
    let size = 0;
    let mtime = 0;
    try {
      const st = fs.statSync(abs);
      exists = true;
      size = st.size;
      mtime = st.mtimeMs;
    } catch {
      // ファイル未設置
    }
    return { ...slot, exists, size, mtime };
  });
  return NextResponse.json({ slots });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const slotPath = String(form.get("path") ?? "");
  const file = form.get("file");

  const slot = slotByPath(slotPath);
  if (!slot) {
    return NextResponse.json({ error: "unknown slot" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file missing" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const abs = absPath(slotPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });

  if (slot.kind === "image") {
    // どんな形式で来ても sharp でJPEGに変換して保存（幅2400pxまで縮小）
    try {
      const sharp = (await import("sharp")).default;
      const out = await sharp(buf)
        .rotate() // スマホ写真の向き補正
        .resize({ width: 2400, withoutEnlargement: true })
        .jpeg({ quality: 84 })
        .toBuffer();
      fs.writeFileSync(abs, out);
    } catch {
      // sharpが使えない環境ではそのまま保存
      fs.writeFileSync(abs, buf);
    }
  } else {
    fs.writeFileSync(abs, buf);
  }

  const st = fs.statSync(abs);
  return NextResponse.json({ ok: true, size: st.size, mtime: st.mtimeMs });
}

export async function DELETE(req: NextRequest) {
  const { path: slotPath } = await req.json();
  const slot = slotByPath(String(slotPath ?? ""));
  if (!slot) {
    return NextResponse.json({ error: "unknown slot" }, { status: 400 });
  }
  const abs = absPath(slot.path);
  try {
    fs.unlinkSync(abs);
  } catch {
    // 既に無い場合はそのまま成功扱い
  }
  return NextResponse.json({ ok: true });
}
