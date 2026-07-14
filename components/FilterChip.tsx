"use client";

type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
};

// アクティブ時のみアクセント色を使う（--color-signal の許可された用途）
export default function FilterChip({ label, active, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-signal bg-signal/10 text-signal"
          : "border-line text-muted hover:border-black/30 hover:text-text"
      }`}
    >
      {label}
    </button>
  );
}
