"use client";

import FilterChip from "@/components/FilterChip";
import {
  type CourseFilter,
  UNLIMITED,
  REGION_OPTIONS,
  ROAD_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  SEASON_OPTIONS,
  CAR_OPTIONS,
} from "@/lib/filter";

type Props = {
  filter: CourseFilter;
  onChange: (next: CourseFilter) => void;
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function formatDuration(min: number): string {
  if (min >= UNLIMITED) return "上限なし";
  if (min < 60) return `〜${min}分`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `〜${h}時間` : `〜${h}時間${m}分`;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-6">
      <legend className="label-en pb-3 pt-6">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export default function FilterPanel({ filter, onChange }: Props) {
  const set = (patch: Partial<CourseFilter>) =>
    onChange({ ...filter, ...patch });

  return (
    <div>
      <Group title="Area">
        {REGION_OPTIONS.map((r) => (
          <FilterChip
            key={r}
            label={r}
            active={filter.regions.includes(r)}
            onClick={() => set({ regions: toggle(filter.regions, r) })}
          />
        ))}
      </Group>

      <fieldset className="border-b border-line pb-6">
        <legend className="label-en pb-3 pt-6">Time</legend>
        <label className="block">
          <span className="sr-only">所要時間の上限</span>
          <input
            type="range"
            min={30}
            max={UNLIMITED}
            step={15}
            value={filter.maxDuration}
            onChange={(e) => set({ maxDuration: Number(e.target.value) })}
            className="w-full accent-white"
          />
        </label>
        <p className="mt-1 font-mono text-xs text-muted">
          {formatDuration(filter.maxDuration)}
        </p>
      </fieldset>

      <Group title="Road Type">
        {ROAD_TYPE_OPTIONS.map((r) => (
          <FilterChip
            key={r}
            label={r}
            active={filter.roadTypes.includes(r)}
            onClick={() => set({ roadTypes: toggle(filter.roadTypes, r) })}
          />
        ))}
      </Group>

      <Group title="Difficulty">
        {DIFFICULTY_OPTIONS.map((d) => (
          <FilterChip
            key={d}
            label={d}
            active={filter.difficulties.includes(d)}
            onClick={() =>
              set({ difficulties: toggle(filter.difficulties, d) })
            }
          />
        ))}
      </Group>

      <Group title="Toll">
        {["無料", "有料"].map((t) => (
          <FilterChip
            key={t}
            label={t}
            active={filter.toll === t}
            onClick={() => set({ toll: filter.toll === t ? "" : t })}
          />
        ))}
      </Group>

      <Group title="Season">
        {SEASON_OPTIONS.map((s) => (
          <FilterChip
            key={s}
            label={s}
            active={filter.seasons.includes(s)}
            onClick={() => set({ seasons: toggle(filter.seasons, s) })}
          />
        ))}
      </Group>

      <Group title="Car">
        {CAR_OPTIONS.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={filter.cars.includes(c)}
            onClick={() => set({ cars: toggle(filter.cars, c) })}
          />
        ))}
      </Group>

      <fieldset className="pb-2">
        <legend className="sr-only">その他</legend>
        <div className="pt-6">
          <FilterChip
            label="車幅注意の道を除外"
            active={filter.excludeNarrow}
            onClick={() => set({ excludeNarrow: !filter.excludeNarrow })}
          />
        </div>
      </fieldset>
    </div>
  );
}
