import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Home-only build (Nov 2026): the sitemap lists "/" alone until more pages are rebuilt. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/our-approach`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/care-programmes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
