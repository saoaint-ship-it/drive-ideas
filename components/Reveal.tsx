"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
};

// スクロールで「下から10px + フェードイン」させるラッパー
export default function Reveal({ children, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<never>} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
