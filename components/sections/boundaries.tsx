import { Section, SectionHeading } from "@/components/ui/layout";
import { BulletList } from "@/components/ui/lists";

/**
 * "What this is not" (compliance). Item wording differs per page and is
 * passed in exactly as in the frames; handoff note 3 asks for it to be made
 * consistent once Julia signs off.
 */
export function Boundaries({
  tone,
  items,
  size = "md",
}: {
  tone: "cream" | "sand";
  items: string[];
  size?: "sm" | "md";
}) {
  return (
    <Section tone={tone} labelledBy="boundaries-heading">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12" data-compliance="boundaries">
        <SectionHeading id="boundaries-heading" eyebrow="What this is not" title="Clear about what we do, and what we don’t." size={size} className="max-w-[440px]" />
        <BulletList items={items} className="lg:pt-6" />
      </div>
    </Section>
  );
}
