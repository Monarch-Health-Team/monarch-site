import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A neutral block standing in for a photograph until the real one is
 * supplied. It makes no image request. The alt text describes the intended
 * photograph and is exposed as the block's accessible name.
 *
 * To swap in the photograph: replace this with <Photo> (components/site/
 * photo.tsx) at the same aspect ratio, `priority` only for the hero.
 */
export function ImagePlaceholder({
  alt,
  className,
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-neutral-200",
        className,
      )}
    >
      <ImageIcon
        aria-hidden
        strokeWidth={1}
        className="size-16 text-neutral-500"
      />
    </div>
  );
}
