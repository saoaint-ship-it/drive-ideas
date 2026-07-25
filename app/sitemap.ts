import type { MetadataRoute } from "next";
import { getAllCourses, getAllPrefectures } from "@/lib/courses";
import { getAllArticles } from "@/lib/articles";
import { collections } from "@/data/collections";
import { plans } from "@/data/plans";
import { features } from "@/data/features";
import { RANKING_METRICS } from "@/lib/rankings";
import { site } from "@/config/site";

// 検索エンジン向けサイトマップ（公開時にそのまま使える）
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/collections`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/pref`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/plans`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/rankings`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/records`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/closures`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/methodology`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${site.url}/updates`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${site.url}/features`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/videos`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/map`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/journal`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${site.url}/disclaimer`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const coursePages: MetadataRoute.Sitemap = getAllCourses().map((c) => ({
    url: `${site.url}/courses/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${site.url}/journal/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${site.url}/collections/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const prefPages: MetadataRoute.Sitemap = getAllPrefectures().map((p) => ({
    url: `${site.url}/pref/${encodeURIComponent(p.name)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const planPages: MetadataRoute.Sitemap = plans.map((p) => ({
    url: `${site.url}/plans/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const featurePages: MetadataRoute.Sitemap = features.map((f) => ({
    url: `${site.url}/features/${f.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const rankingPages: MetadataRoute.Sitemap = RANKING_METRICS.map((m) => ({
    url: `${site.url}/rankings/${m.key}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...coursePages,
    ...articlePages,
    ...collectionPages,
    ...prefPages,
    ...planPages,
    ...featurePages,
    ...rankingPages,
  ];
}
