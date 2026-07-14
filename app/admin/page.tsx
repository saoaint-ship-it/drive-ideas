import type { Metadata } from "next";
import AssetManager from "@/components/AssetManager";

export const metadata: Metadata = {
  title: "素材管理",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-32 pt-28 md:px-8">
      <p className="label-en">Asset Manager</p>
      <h1 className="mt-3 text-3xl font-medium md:text-4xl">素材管理</h1>
      <div className="prose-jp mt-4 max-w-2xl space-y-2 text-sm text-muted">
        <p>
          サイトで使う写真・動画の一覧です。各枠に「どんな素材が欲しいか」を書いてあります。
          <strong className="text-text">
            写真をドラッグ&ドロップ（またはアップロードボタン）で入れると、サイトに即反映されます。
          </strong>
        </p>
        <p>
          画像は自動でWeb用に圧縮されるので、スマホの写真をそのまま入れてOKです。この画面は制作用で、公開サイトには含まれません。
        </p>
      </div>
      <div className="mt-10">
        <AssetManager />
      </div>
    </div>
  );
}
