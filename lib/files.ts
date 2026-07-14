import fs from "fs";
import path from "path";

// public配下のファイルが実在するか（サーバー側でのみ使用可）
export function publicFileExists(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicPath));
  } catch {
    return false;
  }
}
