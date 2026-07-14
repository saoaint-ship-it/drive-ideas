"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ORIGINS = [
  "東京",
  "横浜",
  "名古屋",
  "大阪",
  "京都",
  "福岡",
  "札幌",
  "仙台",
  "広島",
];

// 週末プランナー入口。検索処理は試作段階のためダミー動作
// （/courses?from=xxx へ遷移するUIだけ実装）
export default function WeekendPlanner() {
  const router = useRouter();
  const [from, setFrom] = useState("東京");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/courses?from=${encodeURIComponent(from)}`);
      }}
      className="flex flex-col gap-px sm:flex-row"
    >
      <label className="flex flex-1 items-center border border-line bg-surface">
        <span className="label-en shrink-0 pl-5">From</span>
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full appearance-none bg-transparent px-4 py-4 text-sm focus:outline-none"
        >
          {ORIGINS.map((o) => (
            <option key={o} value={o} className="bg-surface text-text">
              {o}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="border border-line bg-text px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-black/80"
      >
        ここから2時間で行ける道を探す
      </button>
    </form>
  );
}
