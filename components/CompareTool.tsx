"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import {
  COMPARE_ROWS,
  COMPARE_MAX,
  type CompareCourse,
} from "@/lib/compare";

type Props = {
  courses: CompareCourse[];
};

export default function CompareTool({ courses }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const bySlug = useMemo(() => {
    const m = new Map<string, CompareCourse>();
    for (const c of courses) m.set(c.slug, c);
    return m;
  }, [courses]);

  // URL(?c=slug,slug) から選択中のコースを復元する（共有・リロードで再現できる）
  const selected = useMemo(() => {
    const raw = searchParams.get("c")?.split(",").filter(Boolean) ?? [];
    const seen = new Set<string>();
    const out: CompareCourse[] = [];
    for (const slug of raw) {
      if (seen.has(slug)) continue;
      const c = bySlug.get(slug);
      if (c) {
        out.push(c);
        seen.add(slug);
      }
      if (out.length >= COMPARE_MAX) break;
    }
    return out;
  }, [searchParams, bySlug]);

  const setSlugs = useCallback(
    (slugs: string[]) => {
      const qs = slugs.length ? `?c=${slugs.join(",")}` : "";
      router.replace(`${pathname}${qs}`, { scroll: false });
    },
    [router, pathname]
  );

  const add = useCallback(
    (slug: string) => {
      if (selected.length >= COMPARE_MAX) return;
      if (selected.some((c) => c.slug === slug)) return;
      setSlugs([...selected.map((c) => c.slug), slug]);
      setQuery("");
      setPickerOpen(false);
    },
    [selected, setSlugs]
  );

  const remove = useCallback(
    (slug: string) => {
      setSlugs(selected.filter((c) => c.slug !== slug).map((c) => c.slug));
    },
    [selected, setSlugs]
  );

  // 追加候補（未選択のコースをキーワードで絞り込む）
  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedSet = new Set(selected.map((c) => c.slug));
    return courses
      .filter((c) => !selectedSet.has(c.slug))
      .filter((c) => {
        if (!q) return true;
        return [c.name, c.region, c.prefectures.join(" "), c.roadTypes.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
  }, [courses, selected, query]);

  const canAdd = selected.length < COMPARE_MAX;

  // 数値行ごとの最大値（強調表示用）。null は無視する。
  const maxByRow = useMemo(() => {
    const map: Record<string, number | null> = {};
    for (const row of COMPARE_ROWS) {
      if (row.kind !== "num" || !row.num) continue;
      const vals = selected
        .map((c) => row.num!(c))
        .filter((v): v is number => v !== null);
      map[row.key] = vals.length ? Math.max(...vals) : null;
    }
    return map;
  }, [selected]);

  const columnWidth = "min-w-[150px] md:min-w-[200px]";

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      {/* 追加ボタン＋ピッカー */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            disabled={!canAdd}
            aria-expanded={pickerOpen}
            className="border border-line px-4 py-2 text-sm transition-colors hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ＋ コースを追加
          </button>
          <p className="font-mono text-xs text-muted">
            {selected.length} / {COMPARE_MAX}
          </p>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setSlugs([])}
              className="text-xs text-muted underline underline-offset-4 hover:text-text"
            >
              すべてクリア
            </button>
          )}
          {!canAdd && (
            <p className="text-xs text-muted">
              比較できるのは{COMPARE_MAX}コースまでです
            </p>
          )}
        </div>

        {pickerOpen && canAdd && (
          <div className="mt-4 border border-line">
            <div className="border-b border-line p-3">
              <label htmlFor="compare-search" className="sr-only">
                追加するコースを検索
              </label>
              <input
                id="compare-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="道の名前・都道府県で検索"
                className="w-full border border-line bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:border-black/40 focus:outline-none"
              />
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {candidates.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-muted">
                  該当するコースがありません
                </li>
              ) : (
                candidates.slice(0, 60).map((c) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => add(c.slug)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface"
                    >
                      <span className="relative h-9 w-14 shrink-0 overflow-hidden bg-surface">
                        <SmartImage
                          src={c.heroImage}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{c.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {c.prefectures.join(" / ")}
                        </span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="border border-line px-6 py-16 text-center">
          <p className="text-sm text-muted">
            比較したいコースを2つ以上選ぶと、距離・標高・カーブ数などを横並びで見比べられます。
          </p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="mt-5 border border-line px-4 py-2 text-sm transition-colors hover:border-black/40"
          >
            ＋ 最初のコースを選ぶ
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {/* 左上の空セル（行ラベル列の見出し） */}
                <th className="sticky left-0 z-10 w-28 bg-ink text-left align-bottom md:w-40">
                  <span className="label-en block px-1 pb-3">Compare</span>
                </th>
                {selected.map((c) => (
                  <th
                    key={c.slug}
                    className={`${columnWidth} border-b border-line px-2 pb-4 align-top`}
                  >
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => remove(c.slug)}
                        aria-label={`${c.name}を比較から外す`}
                        className="absolute right-0 top-0 z-10 flex h-6 w-6 items-center justify-center border border-line bg-ink text-muted transition-colors hover:border-black/40 hover:text-text"
                      >
                        ×
                      </button>
                      <Link href={`/courses/${c.slug}`} className="group block">
                        <span className="relative block aspect-[3/2] overflow-hidden bg-surface">
                          <SmartImage
                            src={c.heroImage}
                            alt={c.name}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                        </span>
                        <span className="mt-2 block text-xs text-muted">
                          {c.prefectures.join(" / ")}
                        </span>
                        <span className="mt-0.5 block font-medium leading-snug transition-colors group-hover:text-signal">
                          {c.name}
                        </span>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-line">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-ink px-1 py-4 text-left align-middle text-xs font-normal text-muted"
                  >
                    {row.label}
                  </th>
                  {selected.map((c) => {
                    if (row.kind === "text") {
                      return (
                        <td
                          key={c.slug}
                          className={`${columnWidth} px-2 py-4 align-middle`}
                        >
                          {row.text ? row.text(c) : "—"}
                        </td>
                      );
                    }
                    const value = row.num ? row.num(c) : null;
                    const max = maxByRow[row.key];
                    const isMax =
                      value !== null &&
                      max !== null &&
                      value === max &&
                      selected.length > 1;
                    const pct =
                      value !== null && max && max > 0
                        ? Math.max(6, (value / max) * 100)
                        : 0;
                    return (
                      <td
                        key={c.slug}
                        className={`${columnWidth} px-2 py-4 align-middle`}
                      >
                        {value === null ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <>
                            <span
                              className={`font-mono tabular-nums ${
                                isMax ? "font-semibold text-signal" : ""
                              }`}
                            >
                              {row.format ? row.format(value) : value}
                            </span>
                            <span className="mt-1.5 block h-1 w-full max-w-[120px] bg-line/60">
                              <span
                                className={`block h-full ${
                                  isMax ? "bg-signal/70" : "bg-muted/40"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </span>
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected.length > 0 && (
        <p className="mt-6 text-xs text-muted">
          色つきの数値は、選んだコースの中で最も大きい値です。ヘアピン数・カーブ数・最大勾配はルート形状・標高データからの自動計算値（目安）です。
        </p>
      )}
    </div>
  );
}
