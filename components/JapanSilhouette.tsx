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
// 空撮動画・コース地図と同じ「ネオン画風」(ダークネイビー+シアン発光)で描く。
// 形状データは scripts/fetch-japan-outline.mjs で生成した data/japan-outline.ts を使う。
// 沖縄は左上のインセット（枠内の小地図）として表示する。

const OKI_INSET = { x: 24, y: 24, scale: 1.7 };

// ネオン画風の配色(components/map/neonStyle.ts と揃える)
const BG = "#0a1626";
const LAND = "#11233a";
const COAST = "rgba(56,189,248,0.45)";
const DOT = "#7dd3fc";

function Marker({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* 外側の淡い光 */}
      <circle cx={x} cy={y} r="5" fill={DOT} opacity="0.22" />
      {/* 輪郭リング */}
      <circle
        cx={x}
        cy={y}
        r="3"
        fill="rgba(10,22,38,0.6)"
        stroke={DOT}
        strokeWidth="0.8"
      />
      {/* 中心点 */}
      <circle cx={x} cy={y} r="1.1" fill={DOT} />
    </g>
  );
}

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
      {/* 背景(ダークネイビー) */}
      <rect x="0" y="0" width={MAIN_VIEW.w} height={MAIN_VIEW.h} fill={BG} />

      {/* 本土 */}
      {mainlandPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={LAND}
          stroke={COAST}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      ))}
      {mainCourses.map((c) => {
        const [x, y] = projectMain(c.center.lng, c.center.lat);
        return <Marker key={c.slug} x={x} y={y} />;
      })}

      {/* 沖縄インセット（左上の枠） */}
      <g
        transform={`translate(${OKI_INSET.x}, ${OKI_INSET.y}) scale(${OKI_INSET.scale})`}
      >
        <rect
          x="-6"
          y="-6"
          width={OKI_VIEW.w + 12}
          height={OKI_VIEW.h + 12}
          fill="none"
          stroke="rgba(56,189,248,0.3)"
          strokeWidth="0.6"
        />
        {okinawaPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={LAND}
            stroke={COAST}
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        ))}
        {okiCourses.map((c) => {
          const [x, y] = projectOki(c.center.lng, c.center.lat);
          return (
            <g
              key={c.slug}
              transform={`translate(${x}, ${y}) scale(${1 / OKI_INSET.scale})`}
            >
              <Marker x={0} y={0} />
            </g>
          );
        })}
      </g>
      <text
        x={OKI_INSET.x}
        y={OKI_INSET.y + (OKI_VIEW.h + 12) * OKI_INSET.scale + 14}
        fontSize="11"
        fill="rgba(125,211,252,0.55)"
        fontFamily="monospace"
        letterSpacing="0.2em"
      >
        OKINAWA
      </text>
    </svg>
  );
}
