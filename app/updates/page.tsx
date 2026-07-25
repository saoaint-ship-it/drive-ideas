import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { updates } from "@/data/updates";
import { getAllCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "更新履歴",
  description:
    "Drive Ideasの更新履歴。新しく追加したコース・機能をまとめています。",
  alternates: { canonical: "/updates" },
};

export default function UpdatesPage() {
  const courseCount = getAllCourses().length;

  return (
    <div className="pb-32 pt-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="label-en">Updates</p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">更新履歴</h1>
        <p className="prose-jp mt-4 text-sm text-muted">
          このサイトは今も日々育っています。現在{courseCount}
          本のコースを収録。新しく加わったコースや機能をここに記録しています。
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-5 md:px-8">
        <ol className="space-y-14">
          {updates.map((entry) => (
            <Reveal key={entry.date} as="li">
              <div className="border-l-2 border-signal/50 pl-6">
                <p className="font-mono text-sm text-muted">{entry.date}</p>
                <ul className="prose-jp mt-3 space-y-2.5 text-sm text-text/85 md:text-base">
                  {entry.items.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-signal" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  );
}
