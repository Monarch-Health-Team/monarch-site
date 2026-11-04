import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowRight,
  CircleCheck,
  ClipboardCheck,
  FileText,
  FlaskConical,
  LifeBuoy,
  ListChecks,
  MessageCircle,
  PhoneCall,
  Route,
  Salad,
  ScanSearch,
  Smartphone,
  Stethoscope,
  UserRoundCheck,
  Watch,
  type LucideIcon,
} from "lucide-react";

import { Container, Section } from "@/components/primitives";
import {
  Actions,
  Body,
  Breadcrumbs,
  CallLine,
  H2,
  H3,
  HeroTitle,
  IconCard,
  Lead,
  NoteBox,
  OutlineButton,
  P_BODY,
  PageHero,
  ProgrammeSwitcher,
  TextLinkArrow,
} from "@/components/site/page-parts";
import { GENERATED, Photo } from "@/components/site/photo";
import { PROGRAMMES, PROGRAMME_COMMON as C } from "@/content/programmes";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: { absolute: `${p.short} | Monarch Health` },
    description: p.lead,
    alternates: { canonical: `/care-programmes/${p.slug}` },
  };
}

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  "clipboard-check": ClipboardCheck,
  "file-text": FileText,
  "flask-conical": FlaskConical,
  "life-buoy": LifeBuoy,
  "list-checks": ListChecks,
  "message-circle": MessageCircle,
  "phone-call": PhoneCall,
  route: Route,
  salad: Salad,
  "scan-search": ScanSearch,
  smartphone: Smartphone,
  stethoscope: Stethoscope,
  "user-round-check": UserRoundCheck,
  watch: Watch,
};

const GRID_CLASS = {
  3: "md:grid-cols-2 min-[1100px]:grid-cols-3",
  4: "md:grid-cols-2 min-[1100px]:grid-cols-4",
} as const;
const GRID = "mt-8 grid list-none gap-5 p-0";
const SPLIT = "grid gap-8 lg:grid-cols-2 lg:gap-14";
const PHOTO_SIZES = "(min-width: 64rem) 45vw, 92vw";

const OTHERS = [
  { slug: "foundation", label: "Monarch Foundation" },
  { slug: "preserve", label: "Monarch Preserve" },
  { slug: "continuum", label: "Monarch Continuum" },
  { slug: "signature", label: "Monarch Signature" },
];

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (!p) notFound();

  const compareLinks = [
    ...OTHERS.filter((o) => o.slug !== p.slug).map((o) => ({
      href: `/care-programmes/${o.slug}`,
      label: o.label,
    })),
    { href: "/care-programmes#compare", label: C.compareAll },
  ];
  const contact = `/contact?programme=${p.slug}`;

  return (
    <div
      data-clinical-review="https://github.com/Monarch-Health-Team/monarch-site/issues/24"
      data-clinical-items={p.items}
    >
      <ProgrammeSwitcher current={p.short} />
      <Breadcrumbs
        current={p.short}
        trail={[{ href: "/care-programmes", label: "Care Programmes" }]}
      />

      <PageHero
        titleId="p-title"
        background={GENERATED[p.background]}
        photo={GENERATED[p.heroPhoto]}
      >
        <HeroTitle id="p-title">{p.name}</HeroTitle>
        <Lead>{p.lead}</Lead>
        <Body>{p.body}</Body>
        <p className="mt-4 max-w-[65ch] text-base leading-6 text-neutral-700">
          <b>Often suits:</b> {p.suits}
        </p>
        <Actions>
          <OutlineButton href={contact}>{C.button}</OutlineButton>
          <CallLine />
        </Actions>
      </PageHero>

      <Section tone="white" labelledBy="p-inc" className="py-14 md:py-20">
        <Container>
          <h2 id="p-inc" className={H2}>
            {p.includesTitle}
          </h2>
          <ul className={cn(GRID, GRID_CLASS[p.includesCols])}>
            {p.includes.map((c) => (
              <li key={c.title} className="min-w-0">
                <IconCard icon={ICONS[c.icon]} title={c.title}>
                  {c.text}
                </IconCard>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[65ch] text-base leading-6 text-neutral-700">
            {p.includesNote}
          </p>
        </Container>
      </Section>

      <Section tone="navy-wash" labelledBy="p-check" className="py-14 md:py-20">
        <Container>
          <div className={cn(SPLIT, "items-center")}>
            <div className="min-w-0">
              <h2 id="p-check" className={H2}>
                {C.checkTitle}
              </h2>
              <Body>{p.checkIntro}</Body>
              <ul className="mt-5 grid list-none gap-3 p-0">
                {p.checks.map((t) => (
                  <li key={t} className={cn("flex gap-3", P_BODY)}>
                    <CircleCheck
                      aria-hidden
                      className="mt-1 size-6 shrink-0 text-success-700"
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <NoteBox className="mt-6">
                <h3 className={H3}>{C.howOftenTitle}</h3>
                <p className={cn("mt-1", P_BODY)}>{p.howOften}</p>
              </NoteBox>
            </div>
            <Photo
              {...GENERATED[p.checkPhoto]}
              aspect="landscape"
              sizes={PHOTO_SIZES}
              className="w-full rounded-xl"
            />
          </div>
        </Container>
      </Section>

      <Section tone="white" labelledBy="p-between" className="py-14 md:py-20">
        <Container>
          <h2 id="p-between" className={H2}>
            {C.betweenTitle}
          </h2>
          <ul className={cn(GRID, GRID_CLASS[p.betweenCols])}>
            {p.betweenCards.map((c) => (
              <li key={c.title} className="min-w-0">
                <IconCard icon={ICONS[c.icon]} title={c.title}>
                  {c.text}
                </IconCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section
        tone="white"
        labelledBy="p-know"
        className="bg-neutral-100 py-14 md:py-20"
      >
        <Container>
          <div className={cn(SPLIT, "items-start")}>
            <div className="min-w-0">
              <h2 id="p-know" className={H2}>
                {C.knowTitle}
              </h2>
              {C.know.map((t) => (
                <Body key={t}>{t}</Body>
              ))}
            </div>
            <div className="min-w-0 rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className={H3}>{C.compareTitle}</h3>
              <p className={cn("mt-2", P_BODY)}>{C.compareBody}</p>
              <ul className="mt-3 list-none p-0">
                {compareLinks.map((l) => (
                  <li key={l.href}>
                    <TextLinkArrow href={l.href}>
                      {l.label}
                      <ArrowRight aria-hidden className="size-5" />
                    </TextLinkArrow>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="navy-wash" labelledBy="p-talk" className="py-14 md:py-20">
        <Container className="max-w-[760px] text-center">
          <h2 id="p-talk" className={H2}>
            {p.talkTitle}
          </h2>
          <Body className="mx-auto">{C.talkBody}</Body>
          <Actions center>
            <OutlineButton href={contact}>{C.button}</OutlineButton>
            <CallLine />
          </Actions>
        </Container>
      </Section>
    </div>
  );
}
