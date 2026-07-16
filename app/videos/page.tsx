import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { videos, formatVideoTime } from "@/data/videos";
import { getCourseBySlug } from "@/lib/courses";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "動画で見る絶景ドライブ",
  description:
    "YouTubeチャンネル「Holiday Ideas」の絶景ドライブまとめ動画。動画に登場する道は、そのままコースの詳細ページで通行規制や立ち寄りスポットまで確認できます。",
};

export default function VideosPage() {
  return (
    <div>
      {/* ページ見出し（固定ヘッダー分の余白をとる） */}
      <section className="mx-auto max-w-7xl px-5 pt-28 md:px-8 md:pt-36">
        <Reveal>
          <SectionHeading label="Videos" title="動画で巡る、日本の絶景ドライブ" />
          <p className="prose-jp mt-4 max-w-2xl text-sm text-muted">
            YouTubeチャンネル「Holiday Ideas」の絶景ドライブまとめ。動画に登場する道は、
            そのままコースの詳細ページで通行規制や立ち寄りスポットまで確認できます。
          </p>
        </Reveal>
      </section>

      {videos.map((video) => (
        <Reveal
          as="section"
          key={video.id}
          className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"
        >
          <h2 className="text-2xl font-medium md:text-3xl">{video.title}</h2>
          <p className="prose-jp mt-3 max-w-2xl text-sm text-muted">
            {video.description}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
            {/* 動画本体 */}
            <div>
              <YouTubeEmbed youtubeId={video.id} title={video.title} />
              <a
                href={`https://youtu.be/${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-muted transition-colors hover:text-text"
              >
                YouTubeで見る →
              </a>
            </div>

            {/* チャプター＝登場するコース一覧 */}
            <div>
              <p className="label-en">Chapters</p>
              <p className="mt-1 text-xs text-muted">
                道名をタップするとコースの詳細ページへ。時間をタップすると動画のその場面へ飛びます。
              </p>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {video.chapters.map((ch) => {
                  const course = ch.courseSlug
                    ? getCourseBySlug(ch.courseSlug)
                    : undefined;
                  return (
                    <li
                      key={ch.timeSec}
                      className="flex items-center gap-4 py-3"
                    >
                      <a
                        href={`https://youtu.be/${video.id}?t=${ch.timeSec}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 shrink-0 font-mono text-xs text-muted transition-colors hover:text-text"
                      >
                        {formatVideoTime(ch.timeSec)}
                      </a>
                      {course ? (
                        <Link
                          href={`/courses/${course.slug}`}
                          className="group flex flex-1 items-center justify-between gap-2"
                        >
                          <span className="text-sm transition-colors group-hover:text-signal">
                            {ch.label}
                          </span>
                          <span className="shrink-0 text-xs text-muted transition-colors group-hover:text-text">
                            コースを見る →
                          </span>
                        </Link>
                      ) : (
                        <span className="flex-1 text-sm text-muted">
                          {ch.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      ))}

      {/* チャンネルへの導線 */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8 md:py-28">
          <Reveal>
            <p className="prose-jp text-sm text-muted">
              最新のドライブ動画はYouTubeチャンネルで公開しています。
            </p>
            <a
              href={site.sns.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
            >
              YouTube「Holiday Ideas」を見る →
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
