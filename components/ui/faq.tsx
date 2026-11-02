import { Plus } from "lucide-react";

export type Faq = { q: string; a: string };

/**
 * FAQ accordion (v2, How it works #faq): navy rule on top, hairline rows,
 * 22px serif question, 48px minimum trigger, 17px answer. Native
 * details/summary with a shared `name`, so one item is open at a time and
 * it works without JavaScript. The plus turns into an x when open; no
 * rotation with reduced motion (v2 P2-4).
 */
export function FaqList({ items, name = "faq" }: { items: Faq[]; name?: string }) {
  return (
    <div className="border-t border-navy">
      {items.map(({ q, a }, i) => (
        <details key={q} name={name} open={i === 0} className="group border-b border-line">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-6 py-5 lg:py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="type-h3 text-[20px] leading-[1.3] lg:text-[22px]">{q}</h3>
            <Plus
              aria-hidden="true"
              className="size-5 shrink-0 text-navy transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none"
              strokeWidth={1.75}
            />
          </summary>
          <p className="max-w-[680px] pb-6 text-[17px] leading-[1.65] text-body">{a}</p>
        </details>
      ))}
    </div>
  );
}
