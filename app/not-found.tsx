import Link from "@/components/site/live-link";
import {
  Container,
  Section,
  Heading,
  Lead,
  ButtonLink,
} from "@/components/primitives";

const HELPFUL = [
  { label: "Memberships", href: "/memberships" },
  { label: "Clinical programs", href: "/programs" },
  { label: "Care at home", href: "/care" },
  { label: "Resources & tools", href: "/resources" },
  { label: "Frequently asked questions", href: "/faq" },
  { label: "Contact us", href: "/contact" },
];

export default function NotFound() {
  return (
    <Section tone="white">
      <Container>
        <p className="text-body-sm font-semibold tracking-widest uppercase text-orange-600">
          Page not found
        </p>
        <Heading as="h1" size="heading-1" className="mt-4 text-navy-900">
          We could not find that page
        </Heading>
        <Lead className="mt-6">
          The address may have changed, or the link that brought you here may be
          out of date. These are the places people most often need.
        </Lead>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HELPFUL.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex target-min items-center rounded-lg border border-neutral-200 bg-white px-5 py-3 text-neutral-700 hover:border-orange-600 hover:text-orange-700"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/">Back to the home page</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
