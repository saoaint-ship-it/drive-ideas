"use client";

import { useMemo, useState } from "react";
import type { RankingTable as RankingTableData } from "@/types/article";

type Props = {
  data: RankingTableData;
};

type SortState = {
  column: number;
  direction: "asc" | "desc";
} | null;

// ランキング記事のシグネチャー：列ヘッダーのクリックでソートできる表。
// 数値列は等幅フォントで右寄せし、コース詳細の「スペックメーター」と呼応させる
export default function RankingTable({ data }: Props) {
  const [sort, setSort] = useState<SortState>(null);

  const numericColumns = useMemo(
    () =>
      data.headers.map((_, col) =>
        data.rows.every((row) => typeof row[col] === "number")
      ),
    [data]
  );

  const rows = useMemo(() => {
    if (!sort) return data.rows;
    const sorted = [...data.rows].sort((a, b) => {
      const av = a[sort.column];
      const bv = b[sort.column];
      if (typeof av === "number" && typeof bv === "number") {
        return sort.direction === "asc" ? av - bv : bv - av;
      }
      return sort.direction === "asc"
        ? String(av).localeCompare(String(bv), "ja")
        : String(bv).localeCompare(String(av), "ja");
    });
    return sorted;
  }, [data.rows, sort]);

  const toggleSort = (column: number) => {
    setSort((prev) => {
      // 数値列は「大きい順」から始めるのが自然
      const first = numericColumns[column] ? "desc" : "asc";
      const second = first === "desc" ? "asc" : "desc";
      if (prev?.column === column) {
        // 2回目で逆順、3回目で元の並びに戻す
        return prev.direction === first
          ? { column, direction: second }
          : null;
      }
      return { column, direction: first };
    });
  };

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">
          ランキング表。列見出しをクリックすると並べ替えできます
        </caption>
        <thead>
          <tr className="border-b border-line bg-surface">
            {data.headers.map((header, col) => {
              const isSorted = sort?.column === col;
              return (
                <th
                  key={header}
                  scope="col"
                  aria-sort={
                    isSorted
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="p-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col)}
                    className={`flex w-full items-center gap-1.5 px-4 py-3 text-left text-xs font-medium tracking-wider transition-colors hover:text-text ${
                      numericColumns[col] ? "justify-end text-right" : ""
                    } ${isSorted ? "text-text" : "text-muted"}`}
                  >
                    {header}
                    <span className="font-mono text-[9px]" aria-hidden>
                      {isSorted ? (sort.direction === "asc" ? "▲" : "▼") : "△▽"}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.join("-")}
              className={`border-b border-line last:border-b-0 ${
                i % 2 === 1 ? "bg-surface/50" : ""
              }`}
            >
              {row.map((cell, col) => (
                <td
                  key={col}
                  className={`px-4 py-3 ${
                    numericColumns[col]
                      ? "text-right font-mono text-sm"
                      : "text-sm"
                  }`}
                >
                  {typeof cell === "number" ? cell.toLocaleString() : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
