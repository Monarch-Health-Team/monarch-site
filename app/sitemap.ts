import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Home-only build (Nov 2026): the sitemap lists "/" alone until more pages are rebuilt. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];
}
