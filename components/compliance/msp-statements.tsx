import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The MSP and public-system statements from the 8 Oct 2026 review brief
 * (DRAFT, for legal review), kept in one place so the same words appear on
 * every page that uses them. Each block is a titled run of plain text:
 * these are statements to read, not controls, and they are always visible
 * (TC-1.7: none of them may sit behind an accordion or tooltip).
 *
 * `align="center"` is for the homepage's centred sections; the default is
 * left, for the long pages.
 */

/**
 * The same line on every membership card and tier page (9 Oct 2026, MSP
 * brief, for legal review).
 */
export const MSP_CARD_LINE =
  "Fees cover privately paid, uninsured services only. Your MSP-covered care is unchanged.";

/** Where "Learn how Monarch works with MSP" goes. */
export const MSP_PAGE_HREF = "/how-monarch-works-with-msp";

type Align = "left" | "center";

function Block({
  id,
  title,
  align = "left",
  as: Tag = "h2",
  titleClassName,
  className,
  children,
}: {
  id?: string;
  title: string;
  align?: Align;
  as?: "h2" | "h3";
  titleClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Tag
        id={id}
        className={titleClassName ?? "text-heading-3 font-bold text-navy-900"}
      >
        {title}
      </Tag>
      <div
        className={cn(
          "mt-3 space-y-4 text-body-lg font-normal text-neutral-900",
          align === "center" && "mx-auto max-w-[56rem]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function NoPreferentialAccess({
  align,
  as,
  className,
  titleClassName,
  id,
}: {
  align?: Align;
  as?: "h2" | "h3";
  className?: string;
  titleClassName?: string;
  id?: string;
}) {
  return (
    <Block
      id={id}
      title="Membership does not provide preferential access to public healthcare"
      align={align}
      as={as}
      className={className}
      titleClassName={titleClassName}
    >
      <p>
        A Monarch membership does not provide priority, expedited or
        preferential access to MSP-insured physician services, laboratory
        testing, diagnostic imaging, specialist consultations, hospital
        services or other publicly funded healthcare.
      </p>
      <p>
        Membership fees apply only to uninsured services included in the
        membership.
      </p>
      <p>
        If a member requires an MSP-insured service, eligibility, medical
        necessity and access are determined independently of membership status
        and in accordance with the requirements of the public healthcare
        system.
      </p>
    </Block>
  );
}

export function ConsentBlock({
  align,
  as,
  className,
  titleClassName,
  id,
}: {
  align?: Align;
  as?: "h2" | "h3";
  className?: string;
  titleClassName?: string;
  id?: string;
}) {
  return (
    <Block
      id={id}
      title="Your information, your care team"
      align={align}
      as={as}
      className={className}
      titleClassName={titleClassName}
    >
      <p>
        With your consent, Monarch can exchange relevant health information
        with your physicians and other healthcare providers.
      </p>
      <p>
        This may help your care team understand your health goals, assessments,
        results and recommendations and support continuity across different
        parts of your healthcare.
      </p>
      <p>
        Information is shared only as authorized and in accordance with
        applicable privacy requirements.
      </p>
    </Block>
  );
}

export function PhysicianLedExplainer({
  align,
  as,
  className,
  titleClassName,
  id,
}: {
  align?: Align;
  as?: "h2" | "h3";
  className?: string;
  titleClassName?: string;
  id?: string;
}) {
  return (
    <Block
      id={id}
      title="Physician-led healthspan management"
      align={align}
      as={as}
      className={className}
      titleClassName={titleClassName}
    >
      <p>
        Our physicians lead the assessment, interpretation and healthspan
        planning included in your membership. MSP-insured medical services
        provided independently by physicians are separate from the Monarch
        membership and are not provided on a priority basis because of
        membership.
      </p>
    </Block>
  );
}

/** One short note under any list of advanced investigations. */
export function DiagnosticsNote({
  className,
  align = "left",
}: {
  className?: string;
  align?: Align;
}) {
  return (
    <p
      className={cn(
        "text-body-sm leading-snug text-neutral-700",
        align === "center" && "mx-auto max-w-[46rem] text-center",
        className,
      )}
    >
      Membership does not provide expedited access to publicly funded
      diagnostic testing. Where an investigation is privately available, it is
      a privately paid, uninsured service, identified as such and discussed
      with you in advance.
    </p>
  );
}

/**
 * The one-line anchor under the twelve pillars (9 Oct 2026, MSP brief, for
 * legal review). Used under the pillar grids on the homepage and
 * /healthspan; the other pages keep DiagnosticsNote.
 */
export function PillarsNote({
  className,
  align = "left",
}: {
  className?: string;
  align?: Align;
}) {
  return (
    <p
      className={cn(
        "text-body-sm leading-snug text-neutral-700",
        align === "center" && "mx-auto max-w-[56rem] text-center",
        className,
      )}
    >
      Where an investigation is available privately, it is an uninsured
      service, identified as such and discussed with you before it goes ahead.
      Membership does not provide expedited access to publicly funded testing.
    </p>
  );
}
