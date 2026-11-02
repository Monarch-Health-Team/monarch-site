import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { SiteImage } from "@/lib/images";

/*
 * Photo / illustration slot. The wrapper keeps the slot's size (aspect or
 * fixed height from the layout), so the image never shifts layout; the
 * image fills it with object-fit: cover and the slot's object-position.
 * `mirror` flips the photo horizontally (v2 Decision 1); `mobilePosition`
 * is the object-position below 768px when it differs.
 */
export function Photo({
  image,
  sizes,
  className,
  radius = "lg",
  priority = false,
}: {
  image: SiteImage;
  /** Rendered width hints for the srcset, per breakpoint. */
  sizes: string;
  className?: string;
  /** lg = 12px (heroes, splits), md = 10px (cards), none. */
  radius?: "lg" | "md" | "none";
  priority?: boolean;
}) {
  const position = image.position ?? "50% 50%";
  const style = {
    "--pos": position,
    "--pos-m": image.mobilePosition ?? position,
  } as CSSProperties;
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-sand",
        radius === "lg" && "rounded-[12px]",
        radius === "md" && "rounded-[10px]",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={75}
        className={cn("object-cover object-[var(--pos-m)] md:object-[var(--pos)]", image.mirror && "-scale-x-100")}
        style={style}
      />
    </div>
  );
}
