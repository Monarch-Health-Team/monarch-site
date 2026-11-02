import { cn } from "@/lib/cn";

/**
 * Placeholder logo lockup from the hi-fi frames ("M" mark, MONARCH, HEALTH).
 * TODO: replace with the real Monarch Health SVG logo (handoff "Type").
 */
export function LogoLockup({ tone = "light" }: { tone?: "light" | "dark" }) {
  const onNavy = tone === "dark";
  return (
    <span className="inline-flex items-center gap-2.5" data-placeholder="logo">
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full font-serif text-[16px] leading-none",
          onNavy ? "bg-white/15 text-white" : "bg-tint text-accent-text",
        )}
      >
        M
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif text-[19px] tracking-[0.12em]", onNavy ? "text-white" : "text-navy")}>MONARCH</span>
        <span className={cn("mt-1 text-[9px] font-semibold tracking-[0.4em]", onNavy ? "text-on-navy" : "text-accent-text")}>HEALTH</span>
      </span>
    </span>
  );
}
