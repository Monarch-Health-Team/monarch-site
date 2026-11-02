import type { Metadata } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { PreviewBanner } from "@/components/site/preview-banner";
import { SITE } from "@/lib/site";
import { organizationJsonLd } from "@/lib/structured-data";
import { SOFT_LAUNCH_ON } from "@/lib/soft-launch";
// import { BrandButterfly } from "@/components/BrandButterfly";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: SITE.name,
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
  },
  // The soft-launch switch (lib/soft-launch.ts) makes every inheriting page
  // noindex, nofollow; pages with their own robots key already say the same.
  robots: SOFT_LAUNCH_ON
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

/**
 * The two faces every page paints first. Preloading them removes the swap
 * from the fallback stack on the hero headline; the 300 and italic faces
 * load on demand.
 */
const PRELOADED_FONTS = [
  "/fonts/louis-george-cafe-400.woff2",
  "/fonts/louis-george-cafe-700.woff2",
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  for (const href of PRELOADED_FONTS) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }
  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationJsonLd()),
      }}
    />
  );
  // Two bodies rather than one with a conditional slot: a child that renders
  // null still occupies a slot in the RSC payload (serialised as `null`) and
  // renumbers every useId after it, so the unset build would not be
  // byte-identical to the site before the switch (soft-launch-switch c.22).
  // The switch is a build-time constant, so only one branch is ever built.
  if (SOFT_LAUNCH_ON) {
    return (
      <html lang="en-CA">
        <body>
          {jsonLd}
          <PreviewBanner />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </body>
      </html>
    );
  }
  return (
    <html lang="en-CA">
      <body>
        {jsonLd}
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {/* Brand butterfly — flies in when the reader settles on a section
            heading, rests, wanders, and leaves by the opposite edge. Hidden
            site-wide for now (client request, 18 Sep 2026). Restore by
            re-enabling the import above and the element below. */}
        {/* <BrandButterfly /> */}
      </body>
    </html>
  );
}
