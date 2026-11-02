import type { ReactNode } from "react";
import { Section, SectionHeading } from "@/components/ui/layout";
import { MarkerList } from "@/components/ui/lists";

/**
 * Navy authority band, boundaries version (v2 P1-5): "What this is not" on
 * the left, marker rows on #2A4689 hairlines on the right. Item wording
 * differs per page and is passed in exactly as in the v2 copy deck.
 * Pages with more to say (Home) compose the band themselves.
 */
export function Boundaries({ items, answerable }: { items: ReactNode[]; answerable?: ReactNode }) {
  const heading = (
    <SectionHeading id="boundaries-heading" eyebrow="What this is not" title="Clear about what we do, and what we don’t." onNavy size="band" />
  );
  // Home: "Who we're answerable to" on the left, the boundaries on the right.
  if (answerable) {
    return (
      <Section tone="navy" labelledBy="answerable-heading">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-24">
          {answerable}
          <div className="flex flex-col gap-7" data-compliance="boundaries">
            {heading}
            <MarkerList items={items} />
          </div>
        </div>
      </Section>
    );
  }
  return (
    <Section tone="navy" labelledBy="boundaries-heading">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-24" data-compliance="boundaries">
        {heading}
        <MarkerList items={items} className="lg:mt-2" />
      </div>
    </Section>
  );
}
