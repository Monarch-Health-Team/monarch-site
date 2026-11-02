import { Calendar } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { SiteImage } from "@/lib/images";
import { Photo } from "@/components/ui/photo";

/*
 * Editorial card (v2 P1-6): no box or shadow. Photo with 10px radius, serif
 * title, 16px body, optional orange text link.
 */
export function EditorialCard({
  image,
  title,
  body,
  action,
  aspect = "aspect-[4/3]",
  titleSize = "xl",
  sizes = "(min-width: 1440px) 373px, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw",
  className,
}: {
  image: SiteImage;
  title: string;
  body: ReactNode;
  action?: ReactNode;
  aspect?: string;
  titleSize?: "lg" | "xl";
  sizes?: string;
  className?: string;
}) {
  return (
    <li className={cn("flex flex-col gap-4", className)}>
      <Photo image={image} sizes={sizes} radius="md" className={cn("w-full", aspect)} />
      <div className="flex flex-col gap-3 pt-1">
        <h3 className={cn("type-h3 tracking-[-0.01em]", titleSize === "xl" ? "text-[24px] lg:text-[28px]" : "text-[22px] lg:text-[26px]")}>{title}</h3>
        <p className="text-[16px] leading-[1.6] text-body">{body}</p>
        {action ? <div>{action}</div> : null}
      </div>
    </li>
  );
}

/** Free tool card (shadcn Card): white, 1px hairline border, radius 10–12, 28px padding, outline badge. */
export function ToolCard({
  badge,
  title,
  body,
  time,
  action,
}: {
  badge: string;
  title: string;
  body: string;
  time: string;
  action?: ReactNode;
}) {
  return (
    <li className="flex flex-col items-start gap-3.5 rounded-[12px] border border-line bg-white p-7">
      <span className="rounded-full border border-navy px-2.5 py-1 text-[12px] font-medium leading-[1.3] text-navy">{badge}</span>
      <h3 className="type-h3 text-[22px] lg:text-[24px]">{title}</h3>
      <p className="text-[16px] leading-[1.55] text-body">{body}</p>
      <p className="mt-auto flex items-center gap-2 text-[14px] text-muted">
        <Calendar aria-hidden="true" className="size-[15px] text-navy" strokeWidth={1.75} />
        {time}
      </p>
      {action}
    </li>
  );
}
