import Script from "next/script";

// GA4の計測タグ。開発中(npm run dev)はアクセスを計測に混ぜないよう発火させない。
// 測定IDは .env.local の NEXT_PUBLIC_GA_ID で設定する。

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
