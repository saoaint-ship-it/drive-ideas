import { getAffiliate, type AffiliateId } from "@/config/affiliates";
import AffiliateButton from "./AffiliateButton";

type Props = {
  id: AffiliateId;
  title?: string; // 見出しを上書き（例:「長野県周辺の宿を探す」）
  note?: string; // 説明を上書き
};

// 広告ボックス。config にリンクURLが未設定なら何も表示しない（＝空のまま安全に配置できる）。
// 左上に「広告」ラベルを表示し、ステマ規制の明瞭性要件を満たす。
export default function AffiliateBox({ id, title, note }: Props) {
  const program = getAffiliate(id);
  if (!program) return null;

  return (
    <div className="border border-line p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-muted">広告</p>
      <p className="mt-2 text-base font-medium">{title ?? program.label}</p>
      <p className="prose-jp mt-1 text-sm text-muted">{note ?? program.note}</p>
      <div className="mt-4">
        <AffiliateButton href={program.url}>{program.label}</AffiliateButton>
      </div>
    </div>
  );
}
