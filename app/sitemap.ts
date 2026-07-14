import type { MetadataRoute } from "next";
import { getAllCourses } from "@/lib/courses";
import { getAllArticles } from "@/lib/articles";
import { site } from "@/config/site";

// 検索エンジン向けサイトマップ（公開時にそのまま使える）
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/courses`, changeFrequency: "weekly", priority: 0.9 },
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

  return [...staticPages, ...coursePages, ...articlePages];
}
