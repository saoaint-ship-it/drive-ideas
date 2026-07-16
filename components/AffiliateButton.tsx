type Props = {
  href: string;
  children: React.ReactNode;
};

// 広告リンク用のボタン。
// SEO・ステマ規制対応として rel="sponsored nofollow" を必ず付与し、別タブで開く。
export default function AffiliateButton({ href, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="inline-flex items-center justify-center bg-signal px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {children}
    </a>
  );
}
