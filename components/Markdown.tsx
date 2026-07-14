import React from "react";
import Image from "next/image";
import Link from "next/link";
import { publicFileExists } from "@/lib/files";

// 外部ライブラリを使わない最小限のMarkdownレンダラー。
// 対応: ## h2 / ### h3 / - 箇条書き / 1. 番号リスト / **強調** / [リンク](href) / ![画像](src) / 段落
// h2 には目次リンク用の id (section-N) を振る
// 本文中の画像は、ファイルが実際に置かれるまで表示しない（写真は後から差し込める）

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/")) {
        return (
          <Link
            key={i}
            href={href}
            className="underline decoration-line underline-offset-4 transition-colors hover:text-signal"
          >
            {label}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-line underline-offset-4 transition-colors hover:text-signal"
        >
          {label}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function Markdown({ body }: { body: string }) {
  const lines = body.split("\n");
  const blocks: React.ReactNode[] = [];
  let h2Count = 0;
  let listBuffer: { ordered: boolean; items: string[] } | null = null;
  let tableBuffer: string[][] | null = null;
  let key = 0;

  const flushTable = () => {
    if (!tableBuffer || tableBuffer.length === 0) {
      tableBuffer = null;
      return;
    }
    const [head, ...rows] = tableBuffer;
    blocks.push(
      <div key={key++} className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-text/20 text-left">
              {head.map((cell, i) => (
                <th key={i} className="px-3 py-2.5 text-xs font-medium tracking-wider text-muted">
                  {renderInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-line">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2.5">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = null;
  };

  const flushList = () => {
    if (!listBuffer) return;
    const Tag = listBuffer.ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={key++}
        className={`prose-jp mt-5 space-y-2 pl-5 text-sm text-text/85 md:text-base ${
          listBuffer.ordered ? "list-decimal" : "list-disc"
        } marker:text-muted`}
      >
        {listBuffer.items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    listBuffer = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // 表: | セル | セル | の行が続く間バッファする（|---|の区切り行は読み飛ばす）
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;
      if (!tableBuffer) tableBuffer = [];
      tableBuffer.push(cells);
      continue;
    }
    flushTable();

    if (trimmed.startsWith("## ")) {
      flushList();
      h2Count += 1;
      blocks.push(
        <h2
          key={key++}
          id={`section-${h2Count}`}
          className="mt-16 scroll-mt-24 border-b border-line pb-3 text-xl font-medium first:mt-0 md:text-2xl"
        >
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushList();
      const [, alt, src] = imageMatch;
      // 写真がまだ置かれていない枠は表示しない（/adminから設置すると自動で現れる）
      if (!publicFileExists(src)) continue;
      blocks.push(
        <figure key={key++} className="mt-8">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          {alt && (
            <figcaption className="mt-2 text-[11px] text-muted">
              {alt}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push(
        <h3 key={key++} className="mt-10 text-base font-medium md:text-lg">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!listBuffer || listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: false, items: [] };
      }
      listBuffer.items.push(trimmed.slice(2));
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (!listBuffer || !listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: true, items: [] };
      }
      listBuffer.items.push(orderedMatch[1]);
      continue;
    }

    if (trimmed === "") {
      flushList();
      continue;
    }

    flushList();
    blocks.push(
      <p key={key++} className="prose-jp mt-5 text-sm text-text/85 md:text-base">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();
  return <div>{blocks}</div>;
}
