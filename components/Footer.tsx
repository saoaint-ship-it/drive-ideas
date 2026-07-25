import Link from "next/link";
import { site } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg font-medium tracking-[0.2em]">
              {site.nameDisplay}
            </p>
            <p className="mt-3 text-sm text-muted">{site.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            <nav aria-label="フッター">
              <p className="label-en mb-4">Contents</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/courses" className="text-muted hover:text-text">
                    コースを探す
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="text-muted hover:text-text">
                    全国マップ
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="text-muted hover:text-text">
                    ジャーナル
                  </Link>
                </li>
                <li>
                  <Link href="/closures" className="text-muted hover:text-text">
                    冬季閉鎖・通行規制
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted hover:text-text">
                    このサイトについて
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <p className="label-en mb-4">Follow</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={site.sns.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-text"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a
                    href={site.sns.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-text"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>

            <nav aria-label="規約">
              <p className="label-en mb-4">Policy</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-muted hover:text-text">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-muted hover:text-text">
                    免責事項
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted hover:text-text">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
          <Link
            href="/admin"
            className="text-[11px] text-muted underline hover:text-text"
          >
            素材管理（制作用）
          </Link>
        </div>
      </div>
    </footer>
  );
}
