import type { ReactNode } from "react";
import {
  ChevronRight,
  CircleAlert,
  MoveHorizontal,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/primitives";
import Link from "@/components/site/live-link";
import { GENERATED, Photo } from "@/components/site/photo";
import { SHOW_PLACEHOLDERS } from "@/lib/preview";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type PhotoEntry = {
  src: string;
  alt: string;
  focal?: string;
  headTop?: number;
  ratio?: number;
  subjectX?: number;
};

export const P_BODY = "max-w-[65ch] text-[18px] leading-[30px] text-neutral-950";
export const H2 =
  "text-[28px] leading-9 font-bold tracking-tight text-navy-900 md:text-[30px] md:leading-[38px]";
export const H3 = "text-[22px] leading-[30px] font-bold text-navy-900";
const LINK =
  "inline-flex min-h-11 items-center gap-1.5 text-[18px] font-bold text-orange-700 underline underline-offset-4";
const CARD_SHADOW =
  "shadow-[0_1px_2px_rgb(0_20_77/0.06),0_4px_16px_rgb(0_20_77/0.05)]";

/* ------------------------------------------------------------ Breadcrumbs */
export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-white">
      <Container>
        <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 py-2 text-base text-neutral-700">
          <li className="flex items-center gap-1">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-orange-700 underline underline-offset-[3px]"
            >
              Home
            </Link>
            <ChevronRight aria-hidden className="size-4" />
          </li>
          <li aria-current="page" className="inline-flex min-h-11 items-center">
            {current}
          </li>
        </ol>
      </Container>
    </nav>
  );
}

/* ------------------------------------------------------------------ Heroes */
export function PageHero({
  titleId,
  children,
  background = GENERATED.bgHero,
  photo,
}: {
  titleId: string;
  children: ReactNode;
  background?: PhotoEntry;
  photo?: PhotoEntry;
}) {
  return (
    <section
      aria-labelledby={titleId}
      data-no-butterfly="true"
      className="relative isolate overflow-hidden bg-neutral-100 py-10 md:py-[72px]"
    >
      <Photo
        {...background}
        alt=""
        aspect="wide"
        rounded={false}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 aspect-auto h-full w-full"
      />
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0 rounded-xl border border-neutral-200 bg-white/96 p-6 md:p-10">
            {children}
          </div>
          {photo && (
            <Photo
              {...photo}
              aspect="landscape"
              priority
              sizes="(min-width: 64rem) 45vw, 92vw"
              className="w-full rounded-xl"
            />
          )}
        </div>
      </Container>
    </section>
  );
}

export function PlainHero({
  titleId,
  children,
}: {
  titleId: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={titleId} className="bg-navy-50 py-10 md:py-16">
      <Container>{children}</Container>
    </section>
  );
}

export function HeroTitle({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h1
      id={id}
      className="text-[40px] leading-[48px] font-bold tracking-tight text-navy-900 md:text-[48px] md:leading-[56px]"
    >
      {children}
    </h1>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[22px] leading-8 font-semibold text-navy-900">
      {children}
    </p>
  );
}

export function Body({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("mt-4", P_BODY, className)}>{children}</p>;
}

export function Actions({
  children,
  center,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6",
        center && "justify-center",
      )}
    >
      {children}
    </div>
  );
}

export function TextLinkArrow({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(LINK, className)}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ Cards */
export function IconCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6",
        CARD_SHADOW,
      )}
    >
      <span className="inline-flex size-14 items-center justify-center rounded-xl bg-navy-50">
        <Icon aria-hidden className="size-7 text-navy-900" strokeWidth={1.5} />
      </span>
      <h3 className={cn(H3, "mt-4")}>{title}</h3>
      <p className="mt-2 text-[18px] leading-[30px] text-neutral-950">
        {children}
      </p>
    </div>
  );
}

export function PhotoCard({
  photo,
  sizes,
  children,
}: {
  photo: PhotoEntry;
  sizes: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white",
        CARD_SHADOW,
      )}
    >
      <Photo
        {...photo}
        aspect="wide"
        rounded={false}
        sizes={sizes}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-6">{children}</div>
    </div>
  );
}

/* --------------------------------------------------------------- Callouts */
export function NoteBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 border-neutral-200 border-l-navy-900 bg-white px-6 py-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function UrgentBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-l-4 border-neutral-200 border-l-error-700 bg-white px-6 py-5">
      <CircleAlert
        aria-hidden
        className="mt-0.5 size-6 shrink-0 text-error-700"
      />
      <div>{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- Buttons */
export function OutlineButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-orange-600 bg-white px-6 text-center text-[18px] font-bold text-orange-700 sm:w-auto sm:whitespace-nowrap",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function CallLine() {
  return (
    <p className="text-center text-[18px] leading-[30px] sm:text-left">
      Or call{" "}
      <a
        href={SITE.phoneHref}
        className="inline-flex min-h-11 items-center text-[18px] font-bold whitespace-nowrap text-orange-700 underline underline-offset-4"
      >
        {SITE.phone}
      </a>
    </p>
  );
}

/* ------------------------------------------------------------------ Table */
export function ScrollTable({
  captionId,
  caption,
  hint,
  children,
}: {
  captionId: string;
  caption: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <>
      <div
        role="region"
        aria-labelledby={captionId}
        tabIndex={0}
        className="mt-6 max-w-full overflow-x-auto rounded-xl border border-neutral-200 bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-orange-600 [&_tbody_th]:sticky [&_tbody_th]:left-0 [&_tbody_th]:z-[1] [&_tbody_th]:bg-neutral-50 [&_tbody_th]:font-bold [&_tbody_th]:text-navy-900 [&_td]:border-t [&_td]:border-neutral-200 [&_td]:p-4 [&_td]:align-top [&_th]:border-t [&_th]:border-neutral-200 [&_th]:p-4 [&_th]:text-left [&_th]:align-top [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:bg-navy-50 [&_thead_th]:text-[19px] [&_thead_th]:text-navy-900 [&_thead_th:first-child]:left-0 [&_thead_th:first-child]:z-[2]"
      >
        <table className="w-full min-w-[880px] border-collapse text-[17px] leading-[27px]">
          <caption
            id={captionId}
            className="p-4 text-left text-base text-neutral-700"
          >
            {caption}
          </caption>
          {children}
        </table>
      </div>
      <p className="mt-3 flex items-center gap-2 text-base text-neutral-700 min-[1100px]:hidden">
        <MoveHorizontal aria-hidden className="size-5" />
        {hint}
      </p>
    </>
  );
}

/* ----------------------------------------------------- Programme switcher */
const SWITCH = ["Foundation", "Preserve", "Continuum", "Signature"] as const;

export function ProgrammeSwitcher({
  current,
}: {
  current: (typeof SWITCH)[number];
}) {
  return (
    <nav
      aria-label="Programmes"
      className="border-b border-neutral-200 bg-white"
    >
      <Container>
        <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0">
          <li className="flex items-center pr-2 text-base whitespace-nowrap text-neutral-700">
            Programmes:
          </li>
          {SWITCH.map((name) => {
            const on = name === current;
            return (
              <li key={name}>
                <Link
                  href={`/care-programmes/${name.toLowerCase()}`}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-14 items-center px-4 text-[18px] whitespace-nowrap text-navy-900",
                    on &&
                      "font-bold after:absolute after:right-4 after:bottom-0 after:left-4 after:h-[3px] after:bg-orange-600",
                  )}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}

/* ------------------------------------------------------------ On this page */
export function OnThisPage({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-40 lg:self-start">
      <p className="text-[18px] font-bold text-navy-900">On this page</p>
      <ul className="mt-3 grid list-none gap-1 p-0">
        {items.map((i) => (
          <li key={i.href}>
            <a
              href={i.href}
              className="flex min-h-11 items-center text-[18px] text-orange-700 underline"
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------- Placeholder */
export function Placeholder({ children }: { children: ReactNode }) {
  if (!SHOW_PLACEHOLDERS) return null;
  return (
    <div className="rounded-xl border-2 border-dashed border-neutral-400 bg-neutral-50 p-5 text-base leading-6 text-neutral-700">
      <b className="text-navy-900">Placeholder – JJ to supply: </b>
      {children}
    </div>
  );
}
