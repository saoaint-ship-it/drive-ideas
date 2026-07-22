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
// 置かれるセクション側がダークネイビーの「夜」なので、SVG自体は背景を持たず、
// 発光する列島とコースの灯りだけを闇に浮かべる(枠が無いため背景から浮かない)。
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
        {/* 列島の背後にうっすら漂う大気の光 */}
        <radialGradient id="jsHaze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.14)" />
          <stop offset="60%" stopColor="rgba(59,130,246,0.05)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
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

      {/* 大気の光(列島の背後) */}
      <ellipse
        cx={MAIN_VIEW.w * 0.55}
        cy={MAIN_VIEW.h * 0.5}
        rx={MAIN_VIEW.w * 0.5}
        ry={MAIN_VIEW.h * 0.48}
        fill="url(#jsHaze)"
      />

      {/* 本土: 発光する海岸線(ぼかし) → 陸地本体 の2層 */}
      <g filter="url(#jsCoastGlow)">
        {mainlandPaths.map((d, i) => (
          <path
            key={`glow-${i}`}
            d={d}
            fill="none"
            stroke={COAST}
            strokeWidth="1.4"
            strokeOpacity="0.5"
            strokeLinejoin="round"
          />
        ))}
      </g>
      {mainlandPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="url(#jsLand)"
          stroke="rgba(103,232,249,0.45)"
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

      {/* 沖縄インセット（左上・細い枠だけ） */}
      <g
        transform={`translate(${OKI_INSET.x}, ${OKI_INSET.y}) scale(${OKI_INSET.scale})`}
      >
        <rect
          x="-6"
          y="-6"
          width={OKI_VIEW.w + 12}
          height={OKI_VIEW.h + 12}
          fill="none"
          stroke="rgba(125,211,252,0.22)"
          strokeWidth="0.5"
        />
        <g filter="url(#jsCoastGlow)">
          {okinawaPaths.map((d, i) => (
            <path
              key={`oglow-${i}`}
              d={d}
              fill="none"
              stroke={COAST}
              strokeWidth="1"
              strokeOpacity="0.5"
              strokeLinejoin="round"
            />
          ))}
        </g>
        {okinawaPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="url(#jsLand)"
            stroke="rgba(103,232,249,0.45)"
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
        fill="rgba(125,211,252,0.4)"
        fontFamily="monospace"
        letterSpacing="0.2em"
      >
        OKINAWA
      </text>

      {/* 右下のラベル(さりげなく) */}
      <text
        x={MAIN_VIEW.w - 4}
        y={MAIN_VIEW.h - 8}
        fontSize="10"
        textAnchor="end"
        fill="rgba(125,211,252,0.4)"
        fontFamily="monospace"
        letterSpacing="0.25em"
      >
        {courses.length} SCENIC ROUTES
      </text>
    </svg>
  );
}
