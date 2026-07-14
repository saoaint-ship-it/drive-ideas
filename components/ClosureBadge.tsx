import type { Closure } from "@/types/course";

// 一覧カード用の通行規制バッジ
export default function ClosureBadge({ closure }: { closure: Closure }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-signal/60 px-2 py-0.5 text-[10px] tracking-wider text-signal">
      <span className="inline-block h-1 w-1 bg-signal" aria-hidden />
      {closure.type}
    </span>
  );
}
