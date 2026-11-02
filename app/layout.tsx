import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/source-serif-4/opsz-italic.css";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { StickyBookBar } from "@/components/site/sticky-book-bar";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  // Each page sets its full SEO title from the v2 copy deck (title.absolute).
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  // Pre-launch build: keep out of search indexes until go-live.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#00236F",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[8px] focus:bg-navy focus:px-4 focus:py-3 focus:text-[15px] focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <StickyBookBar />
      </body>
    </html>
  );
}
