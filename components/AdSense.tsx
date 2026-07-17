// Google AdSense の共通スクリプト（審査用・広告配信用）。
// GA4と同様、本番ビルドのみ読み込む（開発中に広告リクエストを飛ばさない）。
// asyncスクリプトはReactが自動で<head>に配置するため、審査クローラーからも確実に見える。

const ADSENSE_CLIENT = "ca-pub-9756387925230997";

export default function AdSense() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
