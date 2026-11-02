import type { Metadata } from "next";
import { Fragment } from "react";
import {
  ArrowRight,
  Brain,
  Check,
  CircleCheck,
  ClipboardList,
  Heart,
  House,
  ListChecks,
  PersonStanding,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  MSP_PAGE_HREF,
} from "@/components/compliance/msp-statements";

import {
  Container,
  Section,
  Heading,
  ButtonLink,
} from "@/components/primitives";
import { GENERATED } from "@/components/site/photo";
import { ParallaxBackground } from "@/components/site/parallax-background";
import { ImagePlaceholder } from "@/components/site/image-placeholder";
import { InfoTooltip } from "@/components/site/info-tooltip";
import { COMPLIANCE } from "@/lib/compliance";
import { PillarsGrid } from "@/components/site/pillars-grid";
import { LifeBarGraphic } from "@/components/site/life-bar-graphic";
import { InlineGraphic } from "@/components/site/inline-graphic";
import { BEYOND_DISEASE_SVG } from "@/components/site/beyond-disease-svg";
import { SERVICES_RING_SVG } from "@/components/site/services-ring-svg";
import { MethodSteps } from "@/components/site/method-steps";
import { SpansBand } from "@/components/site/spans-band";
import { MembershipCards } from "@/components/site/membership-cards";
import { METHOD_STEPS } from "@/content/method";
import { HomeReading } from "@/components/site/home-reading";
import { FOCUS_AREAS } from "@/content/healthspan";
import { getAllPosts } from "@/lib/journal";
import { SOFT_LAUNCH_ON } from "@/lib/soft-launch";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} - ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

/**
 * DRAFT COPY throughout. The hero headline and tagline are the client's own
 * wording (19 Sep 2026) and still want a clinician's sign-off before this
 * publishes. The hero is a plain navy ground, no video, by the same request.
 *
 * Ten blocks are specified in docs/website-features.md §1.1. Three are absent
 * here because their destinations do not exist yet, which is the behaviour the
 * states table calls for rather than a shortcut:
 *
 *   - block 5, the self-assessment (the tool is not built)
 *   - block 7, the Operating System paragraph (/operating-system not written)
 *   - block 8, the membership line (/membership blocked on figures and names)
 *
 * TODO: the proof line wants a founding year — "an established practice" is
 * doing the work a date would do better. No year is recorded anywhere yet.
 */

const HOME_PILLARS = [
  {
    Icon: PersonStanding,
    title: "In control of your life",
    text: "Make your own choices, for longer.",
  },
  {
    Icon: Brain,
    title: "Keep your mind sharp",
    text: "Stay engaged, connected and independent.",
  },
  {
    Icon: Heart,
    title: "Maintain your health",
    text: "Prevent decline and manage risks early.",
  },
  {
    Icon: House,
    title: "Age at home",
    text: "With the right support, for as long as possible.",
  },
];

const AGEING_CHECKLIST = [
  "Annual health & functional assessment",
  "Falls and mobility planning",
  "Medication review",
  "Home-based support",
  "A named care coordinator",
];

/** Block 2. Three sentences, per HM-3. */

/** The second line of the "better connected healthcare" section. */
const PILLAR_WORDS = [
  "Multi-disciplinary",
  "Personalized",
  "Continuous",
  "Focused on what matters",
];

/**
 * What ongoing healthspan management delivers (client brief, 10 Oct 2026).
 * No frequencies, response times or services are promised: those wait on
 * each membership's confirmed inclusions.
 */
const ONGOING = [
  {
    title: "A clear plan",
    text: "Understand your most important health risks, priorities and opportunities.",
    Icon: ClipboardList,
  },
  {
    title: "A coordinated approach",
    text: "Translate findings into practical next steps and coordinate relevant recommendations with your existing healthcare providers, with your consent.",
    Icon: Users,
  },
  {
    title: "Follow-through",
    text: "Track agreed actions and identify where further review or support is needed.",
    Icon: ListChecks,
  },
  {
    title: "Progress over time",
    text: "Reassess key measures, review what has changed and adapt your plan as your needs evolve.",
    Icon: TrendingUp,
  },
];

/**
 * The compact explanation beside the memberships (layer B of the MSP
 * wording, client brief 10 Oct 2026). DRAFT, for BC counsel review.
 */
const MEMBERSHIP_POINTS = [
  {
    title: "MSP-insured care stays separate.",
    text: "Where an independent physician provides an MSP-insured service, it is separate from Monarch and from your membership.",
  },
  {
    title: "No preferential access.",
    text: "Membership does not provide priority, expedited or preferential access to MSP-insured services.",
  },
  {
    title: "Your information.",
    text: "With your consent, we share relevant information with your family doctor and other providers to support coordination of care.",
  },
];

export default function HomePage() {
  /*
   * Three (client, 23 Sep 2026). Each article carries its photograph and
   * a two-line summary now, which makes the card two thirds taller, and
   * the brief was that this column must not grow past the communities
   * beside it. Fewer, larger cards is the trade. The rest are one click
   * away on /journal.
   */
  const recent = getAllPosts().slice(0, 3);

  return (
    <>
      {/* ============================================== 1. hero */}
      <section
        aria-labelledby="home-hero-title"
        data-no-butterfly="true"
        className="relative isolate overflow-hidden bg-neutral-50"
      >
        <Container
          className={cn(
            "relative z-10",
            // The header is fixed on the home page unless the soft-launch
            // banner is on (then it is sticky, in flow).
            !SOFT_LAUNCH_ON && "pt-(--header-h)",
          )}
        >
          <div className="py-10 sm:py-14 lg:flex lg:min-h-[34rem] lg:w-[45%] lg:flex-col lg:justify-center lg:py-20">
            <div className="flex items-center gap-4">
              <p className="label-mono text-orange-700 tracking-[0.2em]">
                CONTINUOUS CARE FOR LIFE
              </p>
              <span aria-hidden className="h-0.5 w-10 bg-orange-600" />
            </div>
            <h1
              id="home-hero-title"
              className="mt-5 font-serif text-[2rem]/[1.15] font-semibold text-navy-900 sm:text-5xl/[1.1] lg:text-[2.75rem]/[1.1] xl:text-[3.5rem]/[1.1]"
            >
              <span className="block">Live well.</span>{" "}
              <span className="block">Stay independent.</span>{" "}
              <span className="block">On your terms.</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-body-lg text-neutral-700">
              Monarch Health brings together proactive, personalized and
              continuous care to protect your health, your independence and your{" "}
              <strong className="font-bold text-neutral-950">
                freedom to enjoy life
              </strong>
              .
            </p>
            <div className="mt-8">
              <ButtonLink
                href="/memberships"
                size="lg"
                className="w-full rounded-full sm:w-auto"
              >
                Start Your Healthspan Journey
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
        {/* Placeholder: replace with the photograph (priority, 4:3). */}
        <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[55%]">
          <ImagePlaceholder
            alt="An older couple walking together along a coastal path, the sea behind them, relaxed and smiling"
            className="aspect-[4/3] w-full lg:aspect-auto lg:h-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-neutral-50 to-transparent lg:block"
          />
        </div>
      </section>

      {/* ============================================== 2. four pillars */}
      <section
        aria-labelledby="pillar-row-title"
        className="border-y border-neutral-200 bg-white"
      >
        <h2 id="pillar-row-title" className="sr-only">
          What Monarch Health helps you do
        </h2>
        <Container>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_PILLARS.map(({ Icon, title, text }) => (
              <li
                key={title}
                className="border-t border-neutral-200 px-5 py-8 text-center first:border-t-0 sm:border-t-0 sm:nth-[n+3]:border-t sm:even:border-l lg:border-t-0 lg:nth-[n+3]:border-t-0 lg:border-l lg:first:border-l-0"
              >
                <Icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="mx-auto size-10 text-orange-600"
                />
                <h3 className="mt-4 font-serif text-heading-4 font-semibold text-navy-900">
                  {title}
                </h3>
                <p className="mx-auto mt-2 max-w-[18rem] text-body text-neutral-700">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================== 3. flagship band */}
      <section
        aria-labelledby="ageing-in-place-title"
        className="on-navy bg-navy-950 text-white"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[35fr_40fr_25fr]">
          <ImagePlaceholder
            alt="An older woman walking a golden retriever along a forest trail in dappled sunlight"
            className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[28rem]"
          />
          <div className="px-5 py-10 sm:px-10 lg:px-10 lg:py-14 xl:px-14">
            <div className="flex items-center gap-4">
              <p className="label-mono tracking-[0.2em] text-orange-400">
                OUR FLAGSHIP PROGRAMME
              </p>
              <span aria-hidden className="h-0.5 w-10 bg-orange-400" />
            </div>
            <h2
              id="ageing-in-place-title"
              className="mt-5 font-serif text-4xl/[1.1] font-semibold text-white sm:text-5xl/[1.1]"
            >
              Ageing in Place
            </h2>
            <p className="mt-4 font-serif text-xl/[1.4] text-white sm:text-2xl/[1.4]">
              Proactive, personalized support to help you remain independent at
              home.
            </p>
            <p className="mt-4 max-w-[34rem] text-body-lg text-navy-100">
              Through annual assessments, care planning and ongoing follow-up,
              we identify changing needs early and coordinate the right support
              — before a crisis occurs.
            </p>
            <div className="mt-8">
              <ButtonLink
                href="/care/ageing-in-place"
                size="lg"
                className="w-full rounded-full sm:w-auto"
              >
                Learn about Ageing in Place
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </div>
          </div>
          <div className="border-t border-white/20 px-5 py-10 sm:px-10 lg:border-t-0 lg:border-l lg:px-8 lg:py-14">
            <ul
              aria-label="What Ageing in Place includes"
              className="flex flex-col gap-4"
            >
              {AGEING_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-lg">
                  <CircleCheck
                    aria-hidden
                    strokeWidth={1.5}
                    className="mt-0.5 size-6 shrink-0 text-orange-400"
                  />
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================ snapshot to strategy */}
      {/* Added 7 Oct 2026 (Jeffrey): the band below moved down to make room
          for this statement. The hero now fills the whole viewport (7 Oct
          2026), so this section no longer overlaps its foot and no sliver
          of white shows in the first screen. All centred, first line bold.
          The orange lead-in and the five lines above the headline were
          removed the same day (Jeffrey). */}
      <Section
        tone="white"
        labelledBy="strategy-title"
        className="relative isolate z-10 pt-10 pb-3 md:pt-14 md:pb-4"
      >
        <Container className="text-center">
          <h2
            id="strategy-title"
            className="text-heading-2 font-bold text-navy-900"
          >
            From a snapshot to a strategy.
          </h2>
          <p className="mx-auto mt-3 max-w-[46rem] text-body-lg font-normal text-neutral-900">
            Your health changes throughout the year, and throughout your
            life.
          </p>
        </Container>
      </Section>

      {/* ================================ lifespan ≠ healthspan — HM-2 */}
      {/* Simplified 19 Sep 2026 at the client's request: the "Lifespan ≠
          Healthspan" headline is gone, and the three defining lines run in
          a single row, divided by thin vertical rules, rather than stacked
          — a reference mockup the client supplied. Padding is halved again
          from the already-halved stacked version (py-3.5/py-5, was
          py-7/py-10) — a single row needs less room than three stacked
          lines did, on top of the headline being gone entirely. "The gap"
          stays the everyday word, not the gated measure — no figure, no
          years, no score (TC-2.3, TC-2.6).

          The band is still pulled up over the foot of the hero so a sliver
          of white shows in the first viewport. The overlap never exceeds
          the hero's bottom padding, so it cannot cover the hero's buttons
          on a short screen — re-check this after any change to the
          section's height.

          The background is two thin lines, kept entirely in the margin
          above and below the text (never crossing the line where the copy
          sits, at any viewport or zoom) so they frame the content rather
          than weaving through it. Colour is a light orange, also by
          request; this is a deliberate, one-off exception to the rule
          elsewhere on the site that decoration stays in navy tints and
          orange is reserved for interaction (see the wash-* utilities in
          globals.css) — flagged here rather than changed silently. Hidden
          below md, where there is no safe band left for it to sit in. No
          axis, no numbers, nothing that could be read as a chart of a real
          measurement. */}
      <Section
        tone="white"
        labelledBy="spans-title"
        className="relative isolate z-10 pt-5 pb-10 md:pt-5 md:pb-14"
      >
        <Container className="relative">
          <h2 id="spans-title" className="sr-only">
            Lifespan is not healthspan
          </h2>
          {/* Drawn, not described — see components/site/spans-band.tsx for
              why the two sentences became two bars. */}
          <SpansBand />
        </Container>
      </Section>

      {/* ================================ what lifespan and healthspan mean */}
      {/* The plain-language reading of the band (client brief, 10 Oct 2026),
          in a section of its own (15 Oct 2026, Jeffrey). Reworked 16 Oct 2026
          to cut the text on one side: the picture sits in the middle (two
          sizes smaller than before), one paragraph to its left and one to
          its right, the heading above. Same padding above and below. No
          figure, no promise of a longer life. On a phone: heading, picture,
          then the two paragraphs. */}
      <Section
        tone="wash"
        labelledBy="meaning-title"
        className="py-14 md:py-20"
      >
        <Container>
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-8 text-center shadow-sm md:px-10">
            <h2
              id="meaning-title"
              className="text-heading-3 font-bold text-navy-900"
            >
              Lifespan is how long you live. Healthspan is how well you live.
            </h2>
            <p className="mt-4 text-body-lg font-semibold text-orange-700">
              Monarch helps you understand and manage the factors
              <br className="hidden sm:block" /> that influence your
              healthspan over time.
            </p>
          </div>
          <div className="mt-8 grid items-center gap-8 rounded-2xl border border-neutral-200 bg-white px-6 py-8 text-center shadow-sm md:px-10 lg:grid-cols-[1fr_20rem_1fr] lg:gap-12 lg:py-10 lg:text-left">
            <LifeBarGraphic className="order-first mx-auto w-full max-w-xs lg:order-none lg:max-w-none" />
            <p className="text-body-lg font-normal text-neutral-900 lg:order-first">
              Lifespan measures the years you live. Healthspan describes the
              years you spend in good health, with the physical, cognitive and
              functional capacity to remain independent and engaged in what
              matters to you.
            </p>
            <p className="text-body-lg font-normal text-neutral-900">
              Through personalized assessment, practical care planning and
              ongoing reassessment, we help you make informed decisions about
              your health and track whether those decisions are making a
              meaningful difference.
            </p>
          </div>
        </Container>
      </Section>

      {/* ================================ knowing is not managing */}
      {/* Added 7 Oct 2026 (Jeffrey): a mini section after the band. First
          line is the heading, in orange; the last line is the orange bold
          sign-off. Reworked 16 Oct 2026 the same way as the lifespan section
          above: the picture in the middle (two sizes smaller), the first two
          lines to its left and the rest to its right, the heading above. */}
      <Section
        tone="navy-wash"
        labelledBy="managing-title"
        className="py-14 md:py-20"
      >
        <Container>
          <h2
            id="managing-title"
            className="text-center text-heading-2 font-bold text-orange-700"
          >
            Knowing your health is not the same as managing it.
          </h2>
          <div className="mt-8 grid items-center gap-8 text-center lg:grid-cols-[1fr_15rem_1fr] lg:gap-12 lg:text-left">
            {/* eslint-disable-next-line @next/next/no-img-element -- an SVG has nothing for the image optimiser to do. */}
            <img
              src="/images/gen/trajectory.svg"
              alt=""
              aria-hidden
              loading="lazy"
              className="order-first mx-auto aspect-square w-full max-w-[15rem] lg:order-none"
            />
            <div className="space-y-4 text-body-lg font-normal text-neutral-900 lg:order-first">
              <p>
                An annual physical can tell you a great deal about your health
                today.
              </p>
              <p>But what happens afterwards?</p>
            </div>
            {/* The four "Who ..." questions went on 8 Oct 2026 (MSP access
                wording, for legal review): they implied Monarch provides
                physician follow-up. */}
            <div className="space-y-4 text-body-lg font-normal text-neutral-900">
              <p>
                Your family doctor looks after your insured care. Monarch adds
                what an annual physical can’t: a plan built around your goals,
                follow-through on every recommendation, and someone watching
                your trajectory over time.
              </p>
              <p className="font-bold text-orange-700">
                Monarch was built around what happens next.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ================================== 2. measure act evaluate — HM-3 */}
      {/* Above the twelve pillars: the method is the argument for the
          pillars, so it comes before them. Plain white, no photograph —
          the block is the section rather than something floating on a
          picture.

          Rebuilt again on 20 Sep 2026 as four steps and a loop. The tab
          set, the autoplaying ring and the four figures that stood here
          are in the git history; see components/site/method-steps.tsx
          for what replaced them and why, and content/method.ts for where
          each step's line and count come from in the playbook. */}
      <Section tone="white" labelledBy="method-strip-title">
        <Container>
          {/* The whole method on one tile (client, 21 Sep 2026), so it
              reads as a single object rather than as four rules loose on
              the page. neutral-50 on the white section: the steps are
              drawn in rules and chips with no fills of their own, so the
              tile has to be the thing that lifts, not a border alone. */}
          {/* Moved out of the tile and above it (Jeffrey, 7 Oct 2026): the
              navy title and its sentence, centred, then the tile. */}
          <div className="mb-8 text-center md:mb-10">
            <Heading as="p" size="heading-1" className="mb-2 text-navy-900">
              Beyond the Annual Physical
            </Heading>
            <p className="text-body-lg font-normal text-navy-900">
              Annual assessment is a snapshot of your health and a checklist of
              tests.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-8 shadow-sm sm:px-8 md:px-8 md:py-12">
            {/* The heading alone. The line under it went on 21 Sep 2026
                (client); the four steps say what it said. */}
            <div className="text-center">
              <Heading
                as="h2"
                id="method-strip-title"
                size="heading-1"
                className="text-orange-700"
              >
                Our Method
              </Heading>
              <p className="mt-2 text-body-lg font-normal text-navy-900">
                Your assessment is built around your age, history, risks, goals,
                and what will meaningfully change your care.
              </p>
            </div>

            {/* Four steps and a loop, and nothing else (client, 20 Sep
              2026). The tabs, the ring and the four figures that stood
              here are in the git history; what they carried now lives on
              /method. See components/site/method-steps.tsx. */}
            <div className="mt-10">
              <MethodSteps
                steps={METHOD_STEPS}
                cta={
                  <div className="flex flex-col items-center">
                    {/* Between the loop and the button (Jeffrey, 7 Oct
                        2026): the blue title and two normal lines. */}
                    <p className="text-center text-heading-2 font-bold text-navy-900">
                      We don’t simply tell you what your results are.
                    </p>
                    <div className="mt-3 max-w-[46rem] space-y-4 text-center text-body-lg font-normal text-neutral-900">
                      <p>We help you understand how your health is changing over time:</p>
                      <p>
                        What matters. What to change. Whether it worked. And
                        what to do next.
                      </p>
                    </div>
                    <ButtonLink href="/method" size="lg" className="mt-8 rounded-2xl">
                      Read Our Method in full
                      <ArrowRight aria-hidden className="size-4" />
                    </ButtonLink>
                  </div>
                }
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ================================ the plan does not end with results */}
      {/* Client brief, 10 Oct 2026 (priority 3): what ongoing healthspan
          management delivers, straight after the method. Replaces the
          "Assessment is the beginning" section and its four sentences; the
          orange arrows between the cards are kept. No frequencies, response
          times or services are promised here: those wait on each
          membership's confirmed inclusions. */}
      <Section
        tone="wash"
        labelledBy="ongoing-title"
        className="py-14 md:py-20"
      >
        <Container>
          <div className="text-center">
            <h2
              id="ongoing-title"
              className="text-heading-2 font-bold text-orange-700"
            >
              Your healthspan plan doesn’t end with your results.
            </h2>
            <div className="mx-auto mt-3 max-w-[56rem] space-y-4 text-body-lg font-normal text-neutral-900">
              <p>The assessment tells us where you are.</p>
              <p>
                Membership gives us the relationship to help manage where you
                are going.
              </p>
            </div>
          </div>
          <ol className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-3 text-center xl:max-w-none xl:flex-row xl:items-stretch xl:gap-4">
            {ONGOING.map(({ title, text, Icon }, i) => (
              <Fragment key={title}>
                {i > 0 && (
                  <li
                    aria-hidden
                    className="flex shrink-0 items-center justify-center"
                  >
                    <ArrowRight
                      className="size-5 rotate-90 text-orange-600 xl:rotate-0"
                      strokeWidth={2.75}
                    />
                  </li>
                )}
                <li className="flex w-full flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-6 shadow-sm xl:w-0 xl:flex-1">
                  <span className="flex size-12 items-center justify-center rounded-full bg-orange-50 text-navy-900">
                    <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-heading-5 font-semibold text-navy-900">
                    {title}
                  </h3>
                  <p className="text-body leading-snug font-normal text-neutral-900">
                    {text}
                  </p>
                </li>
              </Fragment>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-[46rem] text-center text-body-lg font-bold text-navy-900">
            The goal is not to measure everything. It is to understand what
            matters, act on it and determine whether the action is helping.
          </p>
        </Container>
      </Section>

      {/* ================================ beyond disease */}
      {/* Added 7 Oct 2026 (Jeffrey): the lead-in to the twelve pillars. Its own
          section from 16 Oct 2026: a picture on the left (a small cross
          opening into a wide view of a life), the heading and two lines on the
          right, the same padding above and below. */}
      <Section
        tone="navy-wash"
        labelledBy="beyond-disease-title"
        className="py-14 md:py-20"
      >
        <Container>
          <div className="grid items-center gap-8 text-center lg:grid-cols-[2fr_3fr] lg:gap-14 lg:text-left">
            <InlineGraphic
              svg={BEYOND_DISEASE_SVG}
              className="mx-auto w-full max-w-sm lg:max-w-none"
            />
            <div>
              <h2
                id="beyond-disease-title"
                className="text-heading-2 font-bold text-orange-700"
              >
                We look beyond disease.
              </h2>
              <div className="mt-3 max-w-[46rem] space-y-4 text-body-lg font-normal text-neutral-900">
                <p>Good healthcare isn’t only about finding what’s wrong.</p>
                <p>
                  It’s also about understanding what allows you to continue
                  living the life you want.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ===================================== 3. twelve topics — HM-4 */}
      {/* Replaced 19 Sep 2026 at the client's request: the hover-driven
          photo carousel that stood here did not land — "the client didn't
          like this, let's remove it" — in favour of a plain grid, six
          pillars per row over two rows, each an icon rather than a photo,
          with the topic's one-line summary behind a hover curtain rather
          than always showing. Heading changed to "12 Pillars of
          Healthspan" as instructed. See components/site/pillars-grid.tsx. */}
      {/* Half the section's own py-10/md:py-14. Set on 20 Sep 2026 to
          halve the gap under the spans band; the method tile moved in
          between the two on 21 Sep 2026, so what it now tightens is the
          gap under the tile. */}
      <Section tone="white" labelledBy="areas-title" className="pt-10 pb-5 md:pt-14 md:pb-7">
        <Container>
          {/* Centred, and just the heading — the link under it went on
              20 Sep 2026. Every one of the twelve cards goes to its own
              topic, and the Learn tab opens the hub. */}
          <div className="text-center">
            <Heading
              as="h2"
              id="areas-title"
              size="heading-2"
              className="font-bold text-navy-900"
            >
              12 Pillars of Healthspan
            </Heading>
            <p className="mt-2 text-body-lg font-normal text-navy-900">
              We measure what matters.
            </p>
            <p className="mt-2 text-body-lg font-normal text-navy-900">
              Your assessment is individualized to your age, health, goals and
              clinical needs. Investigations are chosen according to individual
              risk, clinical appropriateness, the evidence and shared
              decision-making.
            </p>
          </div>

          <div className="mt-5">
            <PillarsGrid areas={FOCUS_AREAS} />
          </div>
        </Container>
      </Section>

      {/* ==================================== 4. what we already run — HM-6 */}
      {/* pb-[30px] overrides just this section's bottom padding (Section's
          own py-16/md:py-24 stays for the top) — client request, 19 Sep
          2026: exactly 30px from the MSP banner's bottom edge to the
          section edge, paired with the banner's own mt-[30px] above.
          Needs the md: variant too, not just the base one: tailwind-merge
          tracks conflicts per breakpoint, so a bare pb-[30px] only
          overrides Section's bare py-16 below the md breakpoint — above
          it, md:py-24 is a separate, un-conflicting declaration and wins
          on its own. */}
      <Section
        tone="white"
        labelledBy="services-title"
        className="wash-radial-bl pb-10 md:pb-14"
      >
        <Container>
          {/* The MSP notice moved off the page and behind this icon
              (client, 20 Sep 2026). It is still the notice required
              wherever memberships are discussed, so it is worth knowing
              what changed: the always-visible carriers are now the fees
              and enrolment notices in the footer, which appear in full
              on every page. Worth a compliance read before launch. */}
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-center">
            <Heading
              as="h2"
              id="services-title"
              size="heading-2"
              className="font-bold text-orange-700"
            >
              Membership Options
            </Heading>
            <InfoTooltip
              label="How memberships work alongside MSP"
              align="center"
              side="bottom"
            >
              {COMPLIANCE.mspDisclosure}
            </InfoTooltip>
          </div>

          {/* The three memberships, not the five services (client,
              20 Sep 2026). See components/site/membership-cards.tsx —
              and note what this section no longer surfaces on the home
              page: family medicine, the insured practice, along with
              ageing in place, home care and nursing. All four keep their
              pages and their place in the nav and the sitemap. */}
          <div className="mt-8">
            <MembershipCards />
          </div>

          {/* Layer B of the MSP wording (client brief, 10 Oct 2026): one
              compact explanation next to the choice itself, in place of the
              several longer ones that stood on this page. DRAFT wording,
              for BC counsel review before publication. */}
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm md:p-8">
            <h3 className="text-center text-heading-4 font-bold text-navy-900">
              What your membership covers
            </h3>
            <ul className="mt-6 grid gap-5 text-body leading-snug text-neutral-900 md:grid-cols-3">
              {MEMBERSHIP_POINTS.map(({ title, text }) => (
                <li key={title} className="flex gap-3">
                  <Check
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-orange-600"
                    strokeWidth={2.5}
                  />
                  <p>
                    <span className="font-semibold text-navy-900">
                      {title}{" "}
                    </span>
                    {text}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-body font-medium text-navy-900">
              Fees for any Monarch service are shared with you in writing before
              you begin.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <ButtonLink
              href="/memberships#compare-heading"
              variant="secondary"
              size="lg"
              className="w-[17rem] rounded-2xl"
            >
              Compare the memberships
            </ButtonLink>
            <ButtonLink
              href="/memberships/find"
              size="lg"
              className="w-[17rem] rounded-2xl"
            >
              <span className="text-center">
                Not sure which fits?
                <br />
                Help me choose
              </span>
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ================================ better connected healthcare */}
      {/* Added 7 Oct 2026 (Jeffrey): a mini section right under the
          Membership Options cards. Navy title; the second line is normal text with
          its full stops in orange. Centred. */}
      <Section
        tone="white"
        labelledBy="connected-title"
        className="pt-8 pb-8 md:pt-8 md:pb-10"
      >
        <Container className="text-center">
          <h2
            id="connected-title"
            className="text-heading-2 font-bold text-navy-900"
          >
            Built around real clinical care.
          </h2>
          <p className="mx-auto mt-3 max-w-[46rem] text-body-lg font-normal text-neutral-900">
            {PILLAR_WORDS.map((w, i) => (
              <Fragment key={w}>
                {i > 0 && " "}
                {w}
                <span className="text-orange-700">.</span>
              </Fragment>
            ))}
          </p>
        </Container>
      </Section>

      {/* ================================ 9. regulators and where — HM-10, HM-12 */}
      <section
        aria-labelledby="trust-title"
        className="relative isolate min-h-[52vh] overflow-hidden bg-white py-14 md:py-20"
      >
        <ParallaxBackground
          {...GENERATED.bgTrust}
          strength={0.2}
          imgClassName="-scale-x-100"
        />
        <Container className="flex min-h-[inherit] items-center">
          {/* The copy sits on one white panel and the photograph is left clear
              (Jeffrey, 21 Oct 2026: the wash took the beauty out of it). */}
          <div className="mr-auto max-w-2xl rounded-2xl bg-white/90 p-6 text-left shadow-lg backdrop-blur-sm md:p-10">
            <Heading
              as="h2"
              id="trust-title"
              size="heading-1"
              className="text-navy-900"
            >
              Who we are answerable to
            </Heading>
            <p className="mt-6 text-body-lg font-bold text-neutral-900">
              Our physicians are registered with the College of Physicians and
              Surgeons of British Columbia. Our nurses are registered with the
              BC College of Nurses and Midwives. Ultimately, we are accountable
              to the people we care for and the families who entrust their care
              to us.
            </p>
            <dl className="mt-12 flex flex-col gap-6 sm:flex-row sm:justify-start sm:gap-12">
              <div>
                <dt className="text-label-sm font-bold text-neutral-700">
                  Where we are
                </dt>
                <dd className="mt-2 font-bold text-neutral-900">{SITE.address}</dd>
              </div>
              <div>
                <dt className="text-label-sm font-bold text-neutral-700">
                  Speak to someone
                </dt>
                <dd className="mt-2 font-bold">
                  <a
                    href={SITE.phoneHref}
                    className="-my-3 inline-block whitespace-nowrap py-3 text-orange-700 underline"
                  >
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-label-sm font-bold text-neutral-700">
                  Who we serve
                </dt>
                <dd className="mt-2 font-bold text-neutral-900">{SITE.region}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>
      {/* ================================ complements your healthcare team */}
      {/* Client brief, 10 Oct 2026 (priority 7 and layer C of the MSP
          wording). Reworked 16 Oct 2026 like the sections above: heading on
          top, the services picture in the middle, one paragraph either side,
          the button to the full explanation centred below. */}
      <Section
        tone="wash"
        labelledBy="family-doctor-title"
        className="py-14 md:py-20"
      >
        <Container>
          <h2
            id="family-doctor-title"
            className="text-center text-heading-2 font-bold text-orange-700"
          >
            Designed to complement your existing healthcare team
          </h2>
          <div className="mt-8 grid items-center gap-8 text-center lg:grid-cols-[1fr_22rem_1fr] lg:gap-12 lg:text-left">
            <InlineGraphic
              svg={SERVICES_RING_SVG}
              className="order-first mx-auto w-full max-w-xs lg:order-none lg:max-w-none"
            />
            <p className="text-body-lg font-normal text-neutral-900 lg:order-first">
              Monarch focuses on proactive healthspan assessment, personalized
              planning and ongoing monitoring. We work with your existing
              healthcare providers, with your consent, to support continuity
              and coordination of care.
            </p>
            <p className="text-body-lg font-normal text-neutral-900">
              Monarch membership does not replace access to MSP-insured medical
              services. If you do not have a family doctor, we can discuss
              available options for finding ongoing primary care.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={MSP_PAGE_HREF} className="rounded-2xl">
              How Monarch works with MSP
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ================================ live well for longer */}
      {/* Added 7 Oct 2026 (Jeffrey): closes the run of mini sections. Orange
          title, normal text, and the last line in bold orange. Centred. */}
      <Section
        tone="white"
        labelledBy="live-well-title"
        className="pt-8 pb-7 md:pt-8 md:pb-10"
      >
        <Container className="text-center">
          <h2
            id="live-well-title"
            className="text-heading-2 font-bold text-orange-700"
          >
            The goal isn’t simply to live longer. It’s to live well for longer.
          </h2>
          <div className="mx-auto mt-3 max-w-[46rem] space-y-4 text-body-lg font-normal text-neutral-900">
            <p>
              To stay strong. To keep moving. To think clearly. To remain
              independent.
            </p>
            <p>To continue doing the things that matter to you.</p>
            <p className="font-bold text-orange-700">
              That’s Continuous Care for Life.
            </p>
          </div>
        </Container>
      </Section>

      {/* ================================ call to action */}
      {/* Added 7 Oct 2026 (Jeffrey), reworked the same day: a photograph of
          a family on a walk (generated with Magnific, public/images/gen/
          bg-care.jpg), the family on the left, the copy and both buttons
          right-aligned on the right. The white wash sits only behind the
          copy, a column on the right, and fades to nothing so the family
          stays unveiled. Below md the copy is centred and the wash covers
          the whole width, since there is no room for two sides.
          "Find Your Care Pathway" goes to the memberships page (confirmed by
          Jeffrey, 7 Oct 2026). */}
      <section
        aria-labelledby="cta-title"
        className="relative isolate overflow-hidden bg-white lg:bg-neutral-100 lg:py-32"
      >
        {/* Below lg the photograph is a band of its own above the copy, so
            the family is never under the words and everything below it is
            centred (design QA, 7 Oct 2026). From lg it is the background,
            with the copy and buttons on its right. */}
        {/* Below lg the photograph is a band of its own above the copy, so
            the family is never under the words. From lg it is the
            background, with the copy and buttons on its right. */}
        <ParallaxBackground
          src="/images/gen/bg-care.jpg"
          focal="0% center"
          strength={0.1}
          className="max-lg:relative max-lg:z-0 max-lg:inset-auto max-lg:h-72 max-lg:w-full sm:max-lg:h-96"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] bg-gradient-to-l from-white/95 via-white/85 to-transparent lg:block"
        />
        <Container className="flex justify-center py-10 lg:justify-end lg:py-0">
          <div className="max-w-xl text-center lg:text-right">
            <h2
              id="cta-title"
              className="text-heading-2 font-bold text-navy-900"
            >
              Don’t wait for a health problem to become your health plan.
            </h2>
            <div className="mt-3 space-y-4 text-body-lg font-normal text-neutral-900">
              <p>Start by understanding where you are today.</p>
              <p>Then build the care you need for the years ahead.</p>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3.5 lg:items-end">
              <ButtonLink href="/memberships" size="lg" className="w-[17rem] rounded-2xl">
                Find Your Care Pathway
              </ButtonLink>
              <ButtonLink
                href="/contact?subject=consultation"
                variant="secondary"
                size="lg"
                className="w-[17rem] rounded-2xl lg:bg-white/90 lg:hover:bg-white"
              >
                Talk to Monarch
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ======================= what to read and where to talk — HM-5
          Rebuilt 21 Sep 2026 at the client's request: the carousel of
          three articles that stood here is now two columns of five, the
          communities beside the writing. Photographs are gone from both.
          See components/site/home-reading.tsx, including the note on
          what the "Top Forums" heading claims. The background, the
          parallax photograph and its white veil, is untouched by
          request. pt/pb-[30px] in both scopes (see the note by the MSP
          banner above on why tailwind-merge needs a same-breakpoint
          override) so the gap below matches the gap above. */}
      {recent.length > 0 && (
        <section
          aria-label="What we have written, and where to talk about it"
          className="relative isolate overflow-hidden bg-neutral-50 py-16 pt-[30px] pb-[30px] md:py-24 md:pt-[30px] md:pb-[30px]"
        >
          <ParallaxBackground {...GENERATED.bgInsights} strength={0.14} />
          {/* A white veil keeps the cards on a near-flat ground; the picture
              is texture, not subject. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/75 to-white/90"
          />
          <Container>
            <HomeReading posts={recent} />
          </Container>
        </section>
      )}

    </>
  );
}
