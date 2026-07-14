type Props = {
  level: 1 | 2 | 3 | 4 | 5;
  compact?: boolean;
};

// ワインディング度を5段階のバーで表現する
export default function WindingBar({ level, compact = false }: Props) {
  const h = compact ? "h-2" : "h-3.5";
  const w = compact ? "w-1.5" : "w-2.5";
  return (
    <div
      className="flex items-end gap-[3px]"
      role="img"
      aria-label={`ワインディング度 ${level} / 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`${h} ${w} ${
            i <= level ? "bg-text" : "bg-line"
          } inline-block`}
        />
      ))}
    </div>
  );
}
