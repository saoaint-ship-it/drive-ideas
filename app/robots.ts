import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 制作用ページはクロールさせない
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
