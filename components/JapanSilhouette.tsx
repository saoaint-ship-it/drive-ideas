import { getAllCourses } from "@/lib/courses";
import {
  MAIN_VIEW,
  OKI_VIEW,
  projectMain,
  projectOki,
  mainlandPaths,
  okinawaPaths,
} from "@/data/japan-outline";

// トップページの全国マップ導線用・実際の海岸線データによる日本地図。
// 空撮動画と同じ世界観(夜の日本を上空から見下ろし、コースの光が灯る)を
// SVGのグラデーション+発光フィルタで表現する。
// 形状データは scripts/fetch-japan-outline.mjs で生成した data/japan-outline.ts を使う。

const OKI_INSET = { x: 24, y: 24, scale: 1.7 };

const DOT = "#7dd3fc"; // コースの光(ネオン画風と同色)
const COAST = "#38bdf8"; // 海岸線の発光色

export default function JapanSilhouette() {
  const courses = getAllCourses();
  const mainCourses = courses.filter((c) => c.center.lng >= 129);
  const okiCourses = courses.filter((c) => c.center.lng < 129);

  return (
    <svg
      viewBox={`0 0 ${MAIN_VIEW.w} ${MAIN_VIEW.h}`}
      className="block h-auto w-full"
      role="img"
      aria-label="全国のドライブコースの位置を示した日本地図"
    >
      <defs>
        {/* 夜空のような背景(中心がわずかに明るい) */}
        <radialGradient id="jsBg" cx="55%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#122844" />
          <stop offset="55%" stopColor="#0a1626" />
          <stop offset="100%" stopColor="#060d19" />
        </radialGradient>
        {/* 陸地の質感(上が明るく下が沈む) */}
        <linearGradient id="jsLand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b3a5e" />
          <stop offset="100%" stopColor="#0e2036" />
        </linearGradient>
        {/* 海岸線の発光 */}
        <filter id="jsCoastGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* コースの光点の発光 */}
        <filter id="jsDotGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect
        x="0"
        y="0"
        width={MAIN_VIEW.w}
        height={MAIN_VIEW.h}
        fill="url(#jsBg)"
      />

      {/* HUD風のコーナーマーク */}
      {(() => {
        const L = 16;
        const P = 10;
        const W = MAIN_VIEW.w;
        const H = MAIN_VIEW.h;
        const d = [
          `M ${P} ${P + L} V ${P} H ${P + L}`,
          `M ${W - P - L} ${P} H ${W - P} V ${P + L}`,
          `M ${W - P} ${H - P - L} V ${H - P} H ${W - P - L}`,
          `M ${P + L} ${H - P} H ${P} V ${H - P - L}`,
        ].join(" ");
        return (
          <path
            d={d}
            fill="none"
            stroke="rgba(125,211,252,0.4)"
            strokeWidth="1"
          />
        );
      })()}

      {/* 本土: 発光する海岸線(ぼかし) → 陸地本体 の2層 */}
      <g filter="url(#jsCoastGlow)">
        {mainlandPaths.map((d, i) => (
          <path
            key={`glow-${i}`}
            d={d}
            fill="none"
            stroke={COAST}
            strokeWidth="1.4"
            strokeOpacity="0.55"
            strokeLinejoin="round"
          />
        ))}
      </g>
      {mainlandPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="url(#jsLand)"
          stroke="rgba(103,232,249,0.5)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      ))}

      {/* コースの光(街灯りのように灯す) */}
      <g filter="url(#jsDotGlow)">
        {mainCourses.map((c) => {
          const [x, y] = projectMain(c.center.lng, c.center.lat);
          return <circle key={c.slug} cx={x} cy={y} r="1.7" fill={DOT} />;
        })}
      </g>

      {/* 沖縄インセット（左上の枠） */}
      <g
        transform={`translate(${OKI_INSET.x}, ${OKI_INSET.y}) scale(${OKI_INSET.scale})`}
      >
        <rect
          x="-6"
          y="-6"
          width={OKI_VIEW.w + 12}
          height={OKI_VIEW.h + 12}
          fill="rgba(10,22,38,0.5)"
          stroke="rgba(125,211,252,0.35)"
          strokeWidth="0.6"
        />
        <g filter="url(#jsCoastGlow)">
          {okinawaPaths.map((d, i) => (
            <path
              key={`oglow-${i}`}
              d={d}
              fill="none"
              stroke={COAST}
              strokeWidth="1"
              strokeOpacity="0.55"
              strokeLinejoin="round"
            />
          ))}
        </g>
        {okinawaPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="url(#jsLand)"
            stroke="rgba(103,232,249,0.5)"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
        ))}
        <g filter="url(#jsDotGlow)">
          {okiCourses.map((c) => {
            const [x, y] = projectOki(c.center.lng, c.center.lat);
            return (
              <circle
                key={c.slug}
                cx={x}
                cy={y}
                r={1.7 / OKI_INSET.scale}
                fill={DOT}
              />
            );
          })}
        </g>
      </g>
      <text
        x={OKI_INSET.x}
        y={OKI_INSET.y + (OKI_VIEW.h + 12) * OKI_INSET.scale + 14}
        fontSize="10"
        fill="rgba(125,211,252,0.5)"
        fontFamily="monospace"
        letterSpacing="0.2em"
      >
        OKINAWA
      </text>

      {/* 右下のラベル(空撮動画のHUD感) */}
      <text
        x={MAIN_VIEW.w - 14}
        y={MAIN_VIEW.h - 14}
        fontSize="10"
        textAnchor="end"
        fill="rgba(125,211,252,0.5)"
        fontFamily="monospace"
        letterSpacing="0.25em"
      >
        {courses.length} SCENIC ROUTES
      </text>
    </svg>
  );
}
