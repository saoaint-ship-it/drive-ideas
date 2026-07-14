"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";

const nav = [
  { href: "/courses", label: "COURSES", jp: "コースを探す" },
  { href: "/map", label: "MAP", jp: "全国マップ" },
  { href: "/journal", label: "JOURNAL", jp: "読み物" },
  { href: "/about", label: "ABOUT", jp: "このサイトについて" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.jpg"
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-display text-sm font-medium tracking-[0.2em]">
            {site.nameDisplay}
          </span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="メイン">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-display text-xs tracking-[0.15em] transition-colors ${
                  active ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* モバイル開閉ボタン */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-text transition-transform ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-px w-full bg-text transition-transform ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <nav
          className="border-t border-line bg-ink md:hidden"
          aria-label="メイン（モバイル）"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-baseline justify-between border-b border-line px-5 py-4"
              onClick={() => setOpen(false)}
            >
              <span className="font-display text-sm tracking-[0.15em]">
                {item.label}
              </span>
              <span className="text-xs text-muted">{item.jp}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
