import { SITE } from "./site";

/**
 * Structured data.
 *
 * Deliberately conservative: MedicalBusiness rather than a schema type that
 * would imply claims we cannot support, and no `aggregateRating` anywhere,
 * since ratings would need consented, verifiable reviews (TC-1.9).
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Victoria and Vancouver Island, British Columbia",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "BC",
      addressCountry: "CA",
      addressLocality: "Victoria",
    },
    medicalSpecialty: "PrimaryCare",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  slug: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    url: `${SITE.url}/journal/${a.slug}`,
    publisher: { "@type": "Organization", name: SITE.name },
  };
}
