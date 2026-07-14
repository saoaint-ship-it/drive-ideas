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
// 形状データは scripts/fetch-japan-outline.mjs で生成した data/japan-outline.ts を使う。
// 沖縄は左上のインセット（枠内の小地図）として表示する。

const OKI_INSET = { x: 24, y: 24, scale: 1.7 };

function Marker({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 2.5} y={y - 2.5} width="5" height="5" fill="#1a1a1a" />
      <rect
        x={x - 6}
        y={y - 6}
        width="12"
        height="12"
        fill="none"
        stroke="rgba(20,20,20,0.3)"
        strokeWidth="1"
      />
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
      {/* 本土 */}
      {mainlandPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="#eceae3"
          stroke="rgba(20,20,20,0.18)"
          strokeWidth="0.7"
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
          stroke="rgba(20,20,20,0.2)"
          strokeWidth="0.6"
        />
        {okinawaPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="#eceae3"
            stroke="rgba(20,20,20,0.18)"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        ))}
        {okiCourses.map((c) => {
          const [x, y] = projectOki(c.center.lng, c.center.lat);
          return (
            <g key={c.slug} transform={`translate(${x}, ${y}) scale(${1 / OKI_INSET.scale})`}>
              <Marker x={0} y={0} />
            </g>
          );
        })}
      </g>
      <text
        x={OKI_INSET.x}
        y={OKI_INSET.y + (OKI_VIEW.h + 12) * OKI_INSET.scale + 14}
        fontSize="11"
        fill="rgba(20,20,20,0.45)"
        fontFamily="monospace"
        letterSpacing="0.2em"
      >
        OKINAWA
      </text>
    </svg>
  );
}
