import type { Metadata } from "next";
import {
  ArrowRight,
  HandHelping,
  House,
  Info,
  Footprints,
  Stethoscope,
} from "lucide-react";

import {
  ButtonLink,
  Card,
  Container,
  Heading,
  Section,
} from "@/components/primitives";
import { GENERATED, Photo } from "@/components/site/photo";
import { ParallaxBackground } from "@/components/site/parallax-background";
import { SHOW_FRAILTY_SECTION } from "@/content/site-flags";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "Care that helps you live well at home, for as long as possible. A physician leads your care, and a care coordinator who knows you by name supports you and your family.",
  alternates: { canonical: "/our-approach" },
};

const STEPS = [
  {
    title: "We get to know you",
    text: "A physician and a nurse review your overall health, including your strength, balance and memory. We also learn about your home, your daily routine and the support you already have, so that we have a clear picture of where you are today.",
  },
  {
    title: "We make a clear plan",
    text: "Your physician chooses the few things that matter most right now, rather than a long list of recommendations. Every step in your plan has a named person responsible for it and a date when we will review it.",
  },
  {
    title: "We check how it is going",
    text: "We measure again on a regular schedule, instead of waiting for something to go wrong. If a step is helping, we continue it, and if it is not making a difference, we change the plan together.",
  },
  {
    title: "We adjust as your needs change",
    text: "Your needs will naturally change over the years, and your plan changes with you, so your care always reflects what is happening in your life today.",
  },
];

const HOME_SERVICES = [
  {
    title: "A home safety visit.",
    text: "We walk through your home with you and look for practical ways to reduce everyday risks.",
    Icon: House,
  },
  {
    title: "Help to prevent falls.",
    text: "Exercises for balance and strength, and a careful review of your medications.",
    Icon: Footprints,
  },
  {
    title: "Help with daily living.",
    text: "Personal support with bathing, dressing, preparing meals and moving safely around your home.",
    Icon: HandHelping,
  },
  {
    title: "Nursing care at home.",
    text: "A registered nurse can visit you for care such as wound dressing and regular health monitoring.",
    Icon: Stethoscope,
  },
];

const PROGRAMMES = ["Foundation", "Preserve", "Continuum", "Signature"];

const BODY = "text-body-lg font-normal text-neutral-900";

export default function OurApproachPage() {
  return (
    <div
      data-clinical-review="https://github.com/Monarch-Health-Team/monarch-site/issues/24"
      data-clinical-items="A1–A10"
    >
      {/* ================================================== hero */}
      <section
        aria-labelledby="approach-title"
        data-no-butterfly="true"
        className="relative isolate overflow-hidden bg-neutral-100 py-12 md:py-20"
      >
        <ParallaxBackground {...GENERATED.bgMethod} strength={0.1} />
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="rounded-lg border border-neutral-200 bg-white/95 p-6 md:p-10">
              <h1
                id="approach-title"
                className="text-display-lg font-bold text-navy-900"
              >
                Our Approach
              </h1>
              <p className="mt-4 text-heading-3 font-semibold text-navy-900">
                Care that helps you live well at home, for as long as possible.
              </p>
              <p className={`mt-4 ${BODY}`}>
                Monarch Health helps older adults stay safe, healthy and
                independent in the home they love. A physician leads your care,
                and a care coordinator who knows you by name supports you and
                your family at every step.
              </p>
              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                <ButtonLink
                  href="/contact?subject=consultation"
                  variant="secondary"
                  size="lg"
                >
                  Arrange a Conversation
                </ButtonLink>
                <p className={BODY}>
                  Or call{" "}
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-orange-700 underline underline-offset-4"
                  >
                    {SITE.phone}
                  </a>
                </p>
              </div>
            </div>
            <Photo
              {...GENERATED.ageingInPlace}
              aspect="landscape"
              priority
              sizes="(min-width: 64rem) 45vw, 92vw"
              className="w-full rounded-lg"
            />
          </div>
        </Container>
      </section>

      {/* ============================================ what matters */}
      <Section tone="white" labelledBy="matters-title" className="py-14 md:py-20">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Heading
                as="h2"
                id="matters-title"
                size="heading-2"
                className="text-navy-900"
              >
                It starts with what matters to you
              </Heading>
              <p className={`mt-4 ${BODY}`}>
                Most people want to stay in their own home as they grow older,
                and we want that for you too. That is why we look at your whole
                life, not just a single test result. We ask about your health,
                your home, your family and the activities you enjoy, and then
                we build a plan around your goals.
              </p>
            </div>
            <Photo
              {...GENERATED.connection}
              aspect="landscape"
              sizes="(min-width: 64rem) 45vw, 92vw"
              className="w-full rounded-lg"
            />
          </div>
        </Container>
      </Section>

      {/* ============================================ how care works */}
      <Section tone="wash" labelledBy="works-title" className="py-14 md:py-20">
        <Container>
          <Heading
            as="h2"
            id="works-title"
            size="heading-2"
            className="text-navy-900"
          >
            How our care works
          </Heading>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex">
                <Card className="w-full rounded-lg p-6 text-neutral-900 shadow-none">
                  <span
                    aria-hidden
                    className="text-heading-1 leading-none font-bold text-orange-700"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-heading-4 font-semibold text-navy-900">
                    <span className="sr-only">{i + 1}. </span>
                    {step.title}
                  </h3>
                  <p className={`mt-2 ${BODY}`}>{step.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ============================ frailty (pending clinical sign-off) */}
      {SHOW_FRAILTY_SECTION && (
        <Section
          tone="white"
          id="frailty"
          labelledBy="frailty-title"
          className="scroll-mt-40 py-14 md:py-20"
        >
          <Container>
            <div className="max-w-3xl space-y-4">
              <Heading
                as="h2"
                id="frailty-title"
                size="heading-2"
                className="text-navy-900"
              >
                Your frailty assessment
              </Heading>
              <p className={BODY}>
                Frailty means your body has less in reserve than it used to, so
                a small setback, like a minor illness or a stumble, can have a
                bigger effect on your daily life. Frailty is not an inevitable
                part of ageing, and much of it can be prevented or improved.
              </p>
              <p className={BODY}>
                At your first assessment, your physician looks at the things
                independence depends on: strength, balance, walking speed, your
                risk of falling, and nutrition. Your physician then uses the
                Clinical Frailty Scale to bring these results together.
                British Columbia&rsquo;s guidelines for doctors recommend this
                tool for grading frailty.
              </p>
              <p className={BODY}>
                Your frailty assessment helps us understand how much support you
                may need, both now and in the years ahead. Based on your results
                and your goals, your physician will suggest the membership that
                fits you best. The choice is always yours, and we will explain
                everything before you decide.
              </p>
            </div>
          </Container>
        </Section>
      )}

      {/* ===================================== Continuum at home */}
      <Section tone="wash" labelledBy="continuum-title" className="py-14 md:py-20">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Heading
                as="h2"
                id="continuum-title"
                size="heading-2"
                className="text-navy-900"
              >
                Support at home with Continuum
              </Heading>
              <p className={`mt-4 ${BODY}`}>
                Continuum is our ageing-in-place programme, and it adds
                practical, hands-on support in your own home. With Continuum,
                we can also offer:
              </p>
            </div>
            <Photo
              {...GENERATED.nursing}
              aspect="landscape"
              sizes="(min-width: 64rem) 45vw, 92vw"
              className="w-full rounded-lg"
            />
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {HOME_SERVICES.map(({ title, text, Icon }) => (
              <li key={title} className="flex">
                <Card className="w-full rounded-lg p-6 text-neutral-900 shadow-none">
                  <Icon
                    aria-hidden
                    className="size-8 text-navy-900"
                    strokeWidth={1.5}
                  />
                  <p className={`mt-3 ${BODY}`}>
                    <strong className="font-semibold text-navy-900">
                      {title}
                    </strong>{" "}
                    {text}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
          <p className={`mt-8 max-w-3xl ${BODY}`}>
            These home services are part of Continuum only. Every member, in
            every programme, has one person to call: a care coordinator who
            knows you, your family and your plan.
          </p>
        </Container>
      </Section>

      {/* ============================================ family */}
      <Section tone="white" labelledBy="family-title" className="py-14 md:py-20">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <Photo
              {...GENERATED.menuTools}
              aspect="landscape"
              sizes="(min-width: 64rem) 45vw, 92vw"
              className="w-full rounded-lg lg:order-last"
            />
            <div>
              <Heading
                as="h2"
                id="family-title"
                size="heading-2"
                className="text-navy-900"
              >
                Your family is part of the team
              </Heading>
              <p className={`mt-4 ${BODY}`}>
                Many families help care for a parent or partner. With your
                permission, we keep your family informed and involved. We also
                share important information with your family doctor, so
                everyone is working from the same plan.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================ programmes */}
      <Section tone="wash" labelledBy="programmes-title" className="py-14 md:py-20">
        <Container>
          <Heading
            as="h2"
            id="programmes-title"
            size="heading-2"
            className="text-navy-900"
          >
            Four programmes, one approach
          </Heading>
          <p className={`mt-4 max-w-3xl ${BODY}`}>
            We offer four care programmes: Foundation, Preserve, Continuum and
            Signature. Every programme follows the same approach. They differ in
            how often we see you and how much support you receive.
          </p>
          <ul
            aria-label="Care programmes"
            className="mt-6 flex flex-wrap gap-3"
          >
            {PROGRAMMES.map((name) => (
              <li
                key={name}
                className="rounded-lg border border-neutral-200 bg-white px-5 py-3 text-body-lg font-semibold text-navy-900"
              >
                {name}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink
              href="/memberships#compare-heading"
              variant="secondary"
              size="lg"
            >
              Compare the programmes
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ============================================ good to know */}
      <Section tone="white" labelledBy="know-title" className="py-14 md:py-20">
        <Container>
          <Card className="mx-auto max-w-4xl rounded-lg border-navy-200 p-6 text-neutral-900 shadow-none md:p-10">
            <div className="flex items-center gap-3">
              <Info aria-hidden className="size-7 shrink-0 text-navy-900" />
              <Heading
                as="h2"
                id="know-title"
                size="heading-2"
                className="text-navy-900"
              >
                Good to know before you start
              </Heading>
            </div>
            <div className="mt-4 space-y-4">
              <p className={BODY}>
                We work alongside your family doctor, and we do not replace
                them. Your MSP coverage stays exactly the same, and membership
                does not give you faster access to MSP-covered tests, scans or
                specialist referrals.
              </p>
              <p className={BODY}>
                Our fees are only for services that MSP does not cover, and we
                explain every fee clearly before any service begins.
              </p>
              <p className={`${BODY} font-semibold text-navy-900`}>
                We do not provide emergency care. If you have a medical
                emergency, call 911 right away.
              </p>
            </div>
          </Card>
        </Container>
      </Section>

      {/* ============================================ closing band */}
      <section aria-labelledby="talk-title" className="bg-navy-50 py-14 md:py-20">
        <Container className="text-center">
          <h2 id="talk-title" className="text-heading-2 font-bold text-navy-900">
            Let&rsquo;s talk about what you need
          </h2>
          <p className={`mx-auto mt-4 max-w-2xl ${BODY}`}>
            Call us or book a time to talk with our team. A first conversation
            is a relaxed chance to ask questions and learn about your options,
            with no pressure to join.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
            <ButtonLink
              href="/contact?subject=consultation"
              variant="secondary"
              size="lg"
            >
              Arrange a Conversation
            </ButtonLink>
            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-11 items-center text-body-lg font-semibold whitespace-nowrap text-orange-700 underline underline-offset-4"
            >
              {SITE.phone}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
