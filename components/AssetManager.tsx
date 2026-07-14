"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SlotInfo = {
  id: string;
  group: string;
  label: string;
  path: string;
  kind: "image" | "video";
  usage: string;
  wanted: string;
  searchQuery?: string;
  exists: boolean;
  size: number;
  mtime: number;
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function SlotCard({
  slot,
  onChanged,
}: {
  slot: SlotInfo;
  onChanged: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "delete" | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setBusy("upload");
      setError("");
      try {
        const form = new FormData();
        form.set("path", slot.path);
        form.set("file", file);
        const res = await fetch("/api/assets", { method: "POST", body: form });
        if (!res.ok) throw new Error((await res.json()).error ?? "失敗");
        onChanged();
      } catch (e) {
        setError(e instanceof Error ? e.message : "アップロードに失敗しました");
      } finally {
        setBusy(null);
      }
    },
    [slot.path, onChanged]
  );

  const remove = useCallback(async () => {
    if (!confirm(`「${slot.label}」の素材を削除します。よろしいですか？\n（サイト上は NO IMAGE 表示になります）`))
      return;
    setBusy("delete");
    setError("");
    try {
      await fetch("/api/assets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: slot.path }),
      });
      onChanged();
    } finally {
      setBusy(null);
    }
  }, [slot, onChanged]);

  const src = `${slot.path}?v=${slot.mtime}`;

  return (
    <div
      className={`border bg-ink ${dragOver ? "border-signal" : "border-line"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) upload(file);
      }}
    >
      {/* プレビュー */}
      <div className="relative aspect-[3/2] bg-surface">
        {slot.exists ? (
          slot.kind === "video" ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={src}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          ) : (
            // アップロード直後の確実な再読込のため next/image ではなく素のimgを使う
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={slot.label}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted">
              NO IMAGE
            </span>
            <span className="border border-signal/50 px-2 py-0.5 text-[10px] text-signal">
              素材募集中
            </span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
            <span className="font-mono text-xs">
              {busy === "upload" ? "UPLOADING..." : "DELETING..."}
            </span>
          </div>
        )}
      </div>

      {/* 情報 */}
      <div className="p-4">
        <p className="text-sm font-medium">{slot.label}</p>
        <p className="prose-jp mt-1.5 text-xs text-text/75">
          <span className="text-muted">欲しい素材: </span>
          {slot.wanted}
        </p>
        <p className="mt-1.5 text-[11px] text-muted">掲載場所: {slot.usage}</p>
        {slot.searchQuery && (
          <a
            href={`https://www.photo-ac.com/main/search?q=${encodeURIComponent(slot.searchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-block text-[11px] text-muted underline hover:text-text"
          >
            photoACで「{slot.searchQuery}」を検索 →
          </a>
        )}
        {slot.exists && (
          <p className="mt-1.5 font-mono text-[10px] text-muted">
            {formatSize(slot.size)}
          </p>
        )}
        {error && <p className="mt-2 text-xs text-signal">{error}</p>}

        {/* 操作 */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => inputRef.current?.click()}
            className="flex-1 border border-line px-3 py-2 text-xs transition-colors hover:border-black/40 disabled:opacity-50"
          >
            {slot.exists ? "置き換え" : "アップロード"}
          </button>
          {slot.exists && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={remove}
              className="border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-signal hover:text-signal disabled:opacity-50"
            >
              削除
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={slot.kind === "video" ? "video/mp4" : "image/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export default function AssetManager() {
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [onlyMissing, setOnlyMissing] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assets", { cache: "no-store" });
    const json = await res.json();
    setSlots(json.slots);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const groups = useMemo(() => {
    const filtered = onlyMissing ? slots.filter((s) => !s.exists) : slots;
    const map = new Map<string, SlotInfo[]>();
    for (const s of filtered) {
      map.set(s.group, [...(map.get(s.group) ?? []), s]);
    }
    return [...map.entries()];
  }, [slots, onlyMissing]);

  const missingCount = slots.filter((s) => !s.exists).length;

  if (!loaded) {
    return <p className="font-mono text-xs text-muted">LOADING...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 border-y border-line py-4">
        <p className="font-mono text-xs text-muted">
          {slots.length} SLOTS / 未設置 {missingCount}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={onlyMissing}
            onChange={(e) => setOnlyMissing(e.target.checked)}
          />
          素材が足りない枠だけ表示
        </label>
      </div>

      {groups.map(([group, groupSlots]) => (
        <section key={group} className="mt-12">
          <h2 className="border-b border-line pb-3 text-lg font-medium">
            {group}
            <span className="ml-3 font-mono text-xs text-muted">
              {groupSlots.filter((s) => s.exists).length}/{groupSlots.length}
            </span>
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupSlots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} onChanged={refresh} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
