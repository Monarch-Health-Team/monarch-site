/**
 * The Monarch butterfly, still.
 *
 * The same artwork as components/BrandButterfly.tsx — which flies in when
 * a reader settles on a section — lifted out as a plain mark so other
 * pieces can use it without the flight machinery. Six paths, one fill, on
 * the 153x140 box the original was drawn in. (It was nine until 20 Sep
 * 2026: three of them carried a group id where their path data should
 * have been, left over from how the artwork was lifted, and drew nothing.)
 *
 * Two exports, because it is wanted in two shapes. `ButterflyMark` is the
 * standalone element, sized by its className. `ButterflyPaths` is the
 * artwork alone, for callers that already have an <svg> of their own and
 * need the butterfly inside it in their own coordinates — see
 * components/site/method-cycle.tsx, which flies it around a ring.
 *
 * Decorative wherever it is used, so it carries no title and is hidden
 * from the accessibility tree by its caller.
 */

/** The box the artwork is drawn in. Callers scaling it need both. */
export const BUTTERFLY_BOX = { width: 153, height: 140 } as const;

export function ButterflyPaths() {
  return (
    <>
      <path d="M141.237 54.4618C142.837 29.2618 126.903 34.9618 118.737 40.9618C115.737 42.9231 112.737 42.4618 115.737 37.4618C118.737 29.4618 146.737 8.46182 152.237 40.9618C157.737 73.4618 122.737 95.9618 107.237 104.962C136.737 81.4618 140.237 63.9618 141.237 54.4618Z" />
      <path d="M144.237 88.4618C137.437 104.862 123.403 110.295 117.237 110.962C113.237 112.962 117.57 112.462 120.237 111.962C137.737 106.592 147.737 95.4618 148.237 89.9618C149.737 79.4618 146.237 83.9618 144.237 88.4618Z" />
      <path d="M143.237 106.962C139.237 114.962 121.237 115.295 112.737 114.462C108.237 114.462 112.737 115.962 114.737 116.222C138.237 118.496 145.737 110.462 146.737 108.962C150.237 101.701 144.237 104.962 143.237 106.962Z" />
      <path d="M97.2367 111.462C98.7367 107.962 106.237 109.462 105.237 112.962C102.933 120.258 98.908 118.307 96.9678 116.222C93.1989 116.482 76.2367 132.462 71.2367 133.462C66.2367 134.462 64.7367 132.962 66.2367 131.462C81.2367 115.962 94.7367 112.962 97.2367 111.462Z" />
      <path d="M62.2367 52.9618C27.4367 39.7618 56.07 87.7952 74.7367 113.462C68.2367 110.462 46.7367 81.4618 40.7367 67.9618C27.7367 38.4618 39.2367 33.4618 53.7367 33.4618C63.7367 -32.5382 98.2367 14.4618 111.737 43.9618C122.537 67.5618 113.737 99.9935 93.2367 112.962C90.8002 114.503 86.7367 116.462 86.7367 116.462C117.237 85.9618 103.237 48.4618 89.7367 35.9618C76.2367 23.4618 65.7367 38.4618 62.2367 52.9618Z" />
      <path d="M20.7367 113.462C14.7367 84.2618 53.2367 103.295 73.2367 116.462C21.2367 90.4618 31.2367 111.962 32.7367 117.962C4.9515 130.407 32.7367 134.933 40.2367 134.462C59.7367 134.462 79.8944 119.883 80.7367 119.462C82.3367 118.662 83.4033 119.128 83.7367 119.462C73.7367 127.462 46.4367 142.562 17.2367 138.962C-19.2633 134.462 12.2367 116.962 20.7367 113.462Z" />
    </>
  );
}

export function ButterflyMark({
  className,
  fill = "#D64000",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 153 140"
      className={className}
      fill={fill}
      aria-hidden
      focusable="false"
    >
      <ButterflyPaths />
    </svg>
  );
}
