import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SOFT_LAUNCH_ON } from "@/lib/soft-launch";

/**
 * Production-aware robots. Non-production (or soft launch) disallows
 * everything. Home-only build (Nov 2026): production allows "/" only.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (SOFT_LAUNCH_ON || !isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/$", disallow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
