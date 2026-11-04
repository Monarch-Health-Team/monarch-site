import type { Metadata } from "next";
import {
  ArrowRight,
  CircleCheck,
  ClipboardList,
  Minus,
  Stethoscope,
  UserRoundCheck,
  Users,
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
  PhotoCard,
  ScrollTable,
  TextLinkArrow,
} from "@/components/site/page-parts";
import { GENERATED, Photo } from "@/components/site/photo";
import {
  CP_COMPARE,
  CP_EVERY,
  CP_FOUR,
  CP_HERO,
  CP_KNOW,
  CP_PROGRAMMES,
  CP_TALK,
  CP_WHICH,
} from "@/content/care-programmes";
import { SHOW_FRAILTY_SECTION } from "@/content/site-flags";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Care Programmes | Monarch Health" },
  description:
    "Four ways to get care that fits your life, each led by a physician and supported by a care coordinator who knows you by name.",
  alternates: { canonical: "/care-programmes" },
};

const ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  "user-round-check": UserRoundCheck,
  "clipboard-list": ClipboardList,
  users: Users,
};

const CARD_SIZES = "(min-width: 1100px) 22vw, (min-width: 768px) 45vw, 92vw";
const GRID = "mt-8 grid list-none gap-5 p-0 md:grid-cols-2 min-[1100px]:grid-cols-4";

export default function CareProgrammesPage() {
  return (
    <div
      data-clinical-review="https://github.com/Monarch-Health-Team/monarch-site/issues/24"
      data-clinical-items="P1–P12, X1–X2"
    >
      <Breadcrumbs current="Care Programmes" />

      <PageHero titleId="cp-title" photo={GENERATED.arrangedAgeingInPlace}>
        <HeroTitle id="cp-title">{CP_HERO.title}</HeroTitle>
        <Lead>{CP_HERO.lead}</Lead>
        <Body>{CP_HERO.body}</Body>
        <Actions>
          <OutlineButton href="#compare">{CP_HERO.button}</OutlineButton>
          <CallLine />
        </Actions>
      </PageHero>

      <Section tone="white" labelledBy="cp-four" className="py-14 md:py-20">
        <Container>
          <h2 id="cp-four" className={H2}>
            {CP_FOUR.title}
          </h2>
          <Body>{CP_FOUR.body}</Body>
          <ul className={GRID}>
            {CP_PROGRAMMES.map((p) => (
              <li key={p.slug} className="min-w-0">
                <PhotoCard photo={GENERATED[p.photo]} sizes={CARD_SIZES}>
                  <h3 className={H3}>{p.name}</h3>
                  <p className={cn("mt-2", P_BODY)}>
                    <b>{p.headline}</b> {p.text}
                  </p>
                  <p className="mt-1 text-base leading-6 text-neutral-700">
                    {p.suits}
                  </p>
                  <TextLinkArrow
                    href={`/care-programmes/${p.slug}`}
                    className="mt-auto pt-3"
                  >
                    {p.link}
                    <ArrowRight aria-hidden className="size-5" />
                  </TextLinkArrow>
                </PhotoCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="navy-wash" labelledBy="cp-every" className="py-14 md:py-20">
        <Container>
          <h2 id="cp-every" className={H2}>
            {CP_EVERY.title}
          </h2>
          <ul className={GRID}>
            {CP_EVERY.cards.map((c) => (
              <li key={c.title} className="min-w-0">
                <IconCard icon={ICONS[c.icon]} title={c.title}>
                  {c.text}
                </IconCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {SHOW_FRAILTY_SECTION && (
        <Section tone="white" labelledBy="cp-which" className="py-14 md:py-20">
          <Container>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="min-w-0">
                <h2 id="cp-which" className={H2}>
                  {CP_WHICH.title}
                </h2>
                <Body>{CP_WHICH.p1}</Body>
                <Body>{CP_WHICH.p2}</Body>
                <div className="mt-7">
                  <TextLinkArrow href="/our-approach#frailty">
                    {CP_WHICH.link}
                    <ArrowRight aria-hidden className="size-5" />
                  </TextLinkArrow>
                </div>
              </div>
              <Photo
                {...GENERATED.assessmentAgeingInPlace}
                aspect="landscape"
                sizes="(min-width: 64rem) 45vw, 92vw"
                className="w-full rounded-xl"
              />
            </div>
          </Container>
        </Section>
      )}

      <Section
        id="compare"
        tone="white"
        labelledBy="cp-compare"
        className="scroll-mt-40 bg-neutral-100 py-14 md:py-20"
      >
        <Container>
          <h2 id="cp-compare" className={H2}>
            {CP_COMPARE.title}
          </h2>
          <Body>{CP_COMPARE.body}</Body>
          <ScrollTable
            captionId="cp-cap"
            caption={CP_COMPARE.caption}
            hint={CP_COMPARE.hint}
          >
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Feature</span>
                </th>
                {CP_COMPARE.head.map((h) => (
                  <th key={h} scope="col" className="w-[21%]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CP_COMPARE.rows.map((r) => (
                <tr key={r.th}>
                  <th scope="row">{r.th}</th>
                  {r.cells.map((c, i) =>
                    typeof c === "string" ? (
                      <td key={i}>{c}</td>
                    ) : "yes" in c ? (
                      <td key={i}>
                        <span className="flex items-start gap-2 font-bold text-navy-900">
                          <CircleCheck
                            aria-hidden
                            className="mt-[3px] size-[22px] shrink-0 text-success-700"
                          />
                          Included
                        </span>
                        {c.detail && (
                          <span className="mt-1 block">{c.detail}</span>
                        )}
                      </td>
                    ) : (
                      <td key={i}>
                        <span className="flex items-start gap-2 text-neutral-700">
                          <Minus
                            aria-hidden
                            className="mt-[3px] size-[22px] shrink-0"
                          />
                          Not included
                        </span>
                      </td>
                    ),
                  )}
                </tr>
              ))}
              <tr>
                <th scope="row">{CP_COMPARE.feesTh}</th>
                <td colSpan={4}>{CP_COMPARE.fees}</td>
              </tr>
            </tbody>
          </ScrollTable>
        </Container>
      </Section>

      <Section tone="white" labelledBy="cp-know" className="py-14 md:py-20">
        <Container className="max-w-[760px]">
          <h2 id="cp-know" className={H2}>
            {CP_KNOW.title}
          </h2>
          <NoteBox className="mt-6">
            {CP_KNOW.paragraphs.map((t, i) => (
              <p key={t} className={cn(P_BODY, i === 0 ? "mt-0" : "mt-4")}>
                {t}
              </p>
            ))}
          </NoteBox>
        </Container>
      </Section>

      <Section tone="navy-wash" labelledBy="cp-talk" className="py-14 md:py-20">
        <Container className="max-w-[760px] text-center">
          <h2 id="cp-talk" className={H2}>
            {CP_TALK.title}
          </h2>
          <Body className="mx-auto">{CP_TALK.body}</Body>
          <Actions center>
            <OutlineButton href="/contact?subject=consultation">
              {CP_TALK.button}
            </OutlineButton>
            <CallLine />
          </Actions>
        </Container>
      </Section>
    </div>
  );
}
