import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Card: white, 1px #E2D6C2 border, 14px radius, 28px padding, 12px gap, soft blue shadow. */
export function Card({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "li" | "article";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("flex flex-col gap-3 rounded-[14px] border border-line bg-white p-6 shadow-card sm:p-7", className)}>
      {children}
    </Tag>
  );
}

/** 48px #FBE4D8 circle with a Lucide line icon stroked #D94000. */
export function IconBadge({ icon: Icon, className, size = "md" }: { icon: LucideIcon; className?: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-tint text-accent",
        size === "md" ? "size-12" : "size-10",
        className,
      )}
    >
      <Icon className={size === "md" ? "size-5" : "size-[18px]"} strokeWidth={1.75} />
    </span>
  );
}
