import { Plus } from "lucide-react";

/**
 * FAQ rows: question Inter Medium 18 with a "+" toggle. Answers are not
 * written yet (handoff note 8), so each opens to a labelled placeholder.
 */
export function FaqList({ questions }: { questions: string[] }) {
  return (
    <div className="border-t border-line">
      {questions.map((q) => (
        <details key={q} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium text-navy sm:text-[18px] [&::-webkit-details-marker]:hidden">
            <span>{q}</span>
            <Plus aria-hidden="true" className="size-5 shrink-0 transition-transform group-open:rotate-45" strokeWidth={1.75} />
          </summary>
          <p className="pb-5 text-[15px] text-muted" data-placeholder="copy">
            [Answer to come: not yet written in the handoff.]
          </p>
        </details>
      ))}
    </div>
  );
}
