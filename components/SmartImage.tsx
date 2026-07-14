"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

// 画像がない/読み込めない場合は「NO IMAGE」の無地プレースホルダーを表示する
export default function SmartImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  priority,
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-surface ${
          fill ? "absolute inset-0" : ""
        } ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted">
          NO IMAGE
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
