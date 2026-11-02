/**
 * A picture of our own, drawn as markup and set inline (so any text in it uses
 * the site's own type). Decorative: the words beside it say all of it. The
 * markup is static and ours (see the files it is imported from), never user
 * input.
 */
export function InlineGraphic({
  svg,
  className,
}: {
  svg: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`${className ?? ""} [&>svg]:block [&>svg]:h-auto [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
