type Props = {
  profile: number[]; // 等間隔の標高サンプル(m)
  distanceKm: number;
};

// チャートライブラリを使わない自前SVGの標高プロファイル
export default function ElevationProfile({ profile, distanceKm }: Props) {
  if (profile.length < 2) return null;

  const W = 800;
  const H = 180;
  const PAD_X = 0;
  const PAD_TOP = 24;
  const PAD_BOTTOM = 28;

  const min = Math.min(...profile);
  const max = Math.max(...profile);
  const range = Math.max(max - min, 1);

  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const stepX = (W - PAD_X * 2) / (profile.length - 1);

  const points = profile.map((v, i) => {
    const x = PAD_X + i * stepX;
    const y = PAD_TOP + innerH * (1 - (v - min) / range);
    return [x, y] as const;
  });

  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${polyline} ${W - PAD_X},${H - PAD_BOTTOM} ${PAD_X},${H - PAD_BOTTOM}`;

  const maxIndex = profile.indexOf(max);
  const [maxX, maxY] = points[maxIndex];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label={`標高プロファイル。最低${min}m、最高${max}m`}
      >
        {/* 目盛りのヘアライン */}
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={0}
            x2={W}
            y1={PAD_TOP + innerH * t}
            y2={PAD_TOP + innerH * t}
            stroke="rgba(20,20,20,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* 塗り */}
        <polygon points={area} fill="rgba(20,20,20,0.05)" />

        {/* 折れ線 */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1.5"
        />

        {/* 最高地点 */}
        <circle cx={maxX} cy={maxY} r="3" fill="#C9362E" />
        <text
          x={Math.min(Math.max(maxX, 40), W - 60)}
          y={maxY - 8}
          textAnchor="middle"
          fill="#757068"
          fontSize="11"
          fontFamily="var(--font-roboto-mono), monospace"
        >
          {max.toLocaleString()}m
        </text>

        {/* 両端ラベル */}
        <text
          x={0}
          y={H - 8}
          fill="#757068"
          fontSize="11"
          fontFamily="var(--font-roboto-mono), monospace"
        >
          0km
        </text>
        <text
          x={W}
          y={H - 8}
          textAnchor="end"
          fill="#757068"
          fontSize="11"
          fontFamily="var(--font-roboto-mono), monospace"
        >
          {distanceKm.toFixed(1)}km
        </text>
      </svg>
      <figcaption className="sr-only">
        コースの標高変化を示す折れ線グラフ
      </figcaption>
    </figure>
  );
}
