import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import Reveal from "@/components/Reveal";
import { collections, getCollectionBySlug } from "@/data/collections";
import { getAllCourses } from "@/lib/courses";
import { site } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollectionBySlug(slug);
  if (!col) return {};
  return {
    title: col.title,
    description: col.description,
    alternates: { canonical: `/collections/${col.slug}` },
    openGraph: {
      title: col.title,
      description: col.description,
      url: `/collections/${col.slug}`,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const col = getCollectionBySlug(slug);
  if (!col) notFound();

  const matched = getAllCourses().filter(col.filter);

  // SEO: まとめページの構造化データ(ItemList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: col.title,
    description: col.description,
    itemListElement: matched.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${site.url}/courses/${c.slug}`,
    })),
  };

  return (
    <div className="pb-32 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="label-en">
          <Link href="/collections" className="transition-colors hover:text-text">
            Collections
          </Link>
        </p>
        <h1 className="mt-3 text-3xl font-medium md:text-4xl">{col.title}</h1>
        <p className="prose-jp mt-6 max-w-2xl text-sm text-text/85 md:text-base">
          {col.intro}
        </p>
        <p className="mt-4 font-mono text-xs text-muted">
          {matched.length} COURSES
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-x-8 gap-y-14 px-5 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
        {matched.map((course) => (
          <Reveal key={course.slug}>
            <CourseCard course={course} />
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <Link
          href="/collections"
          className="inline-block border border-line px-6 py-3 text-sm transition-colors hover:border-black/40"
        >
          ← 他のテーマを見る
        </Link>
      </div>
    </div>
  );
}
