import WindingBar from "@/components/WindingBar";
import type { Course } from "@/types/course";

type Props = {
  course: Pick<
    Course,
    "distanceKm" | "durationMin" | "elevationGainM" | "windingLevel"
  >;
  compact?: boolean;
};

function formatDuration(min: number): { value: string; unit: string } {
  if (min < 60) return { value: String(min), unit: "min" };
  const h = Math.floor(min / 60);
  const m = min % 60;
  return { value: m === 0 ? `${h}` : `${h}:${String(m).padStart(2, "0")}`, unit: m === 0 ? "h" : "h" };
}

// シグネチャー要素：車の計器盤を思わせる横一列のスペック行
export default function SpecMeter({ course, compact = false }: Props) {
  const dur = formatDuration(course.durationMin);

  const items: { label: string; value: string; unit: string }[] = [
    { label: "Distance", value: course.distanceKm.toFixed(1), unit: "km" },
    { label: "Time", value: dur.value, unit: dur.unit },
    {
      label: "Elevation",
      value: `+${course.elevationGainM.toLocaleString()}`,
      unit: "m",
    },
  ];

  if (compact) {
    return (
      <div className="flex items-stretch border-t border-line pt-2.5">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex-1 ${i > 0 ? "border-l border-line pl-3" : ""}`}
          >
            <p className="label-en !text-[9px] !tracking-[0.14em]">
              {item.label}
            </p>
            <p className="mt-0.5 font-mono text-sm">
              {item.value}
              <span className="ml-0.5 text-[10px] text-muted">{item.unit}</span>
            </p>
          </div>
        ))}
        <div className="flex-1 border-l border-line pl-3">
          <p className="label-en !text-[9px] !tracking-[0.14em]">Winding</p>
          <div className="mt-1.5">
            <WindingBar level={course.windingLevel} compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 border-y border-line md:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`px-5 py-6 md:px-8 md:py-8 ${
            i > 0 ? "md:border-l md:border-line" : ""
          } ${i % 2 === 1 ? "border-l border-line md:border-l" : ""} ${
            i >= 2 ? "border-t border-line md:border-t-0" : ""
          }`}
        >
          <p className="label-en">{item.label}</p>
          <p className="mt-3 font-mono text-3xl font-light md:text-4xl">
            {item.value}
            <span className="ml-1.5 text-base text-muted">{item.unit}</span>
          </p>
        </div>
      ))}
      <div className="border-l border-t border-line px-5 py-6 md:border-t-0 md:px-8 md:py-8">
        <p className="label-en">Winding</p>
        <div className="mt-5">
          <WindingBar level={course.windingLevel} />
        </div>
      </div>
    </div>
  );
}
