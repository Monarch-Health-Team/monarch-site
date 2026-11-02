import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/layout";
import { ROUTES } from "@/lib/site";

// Root layout template renders this as "Page not found · Monarch Health".
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section aria-labelledby="page-title" className="bg-cream py-24">
      <Container className="flex flex-col items-start gap-6">
        {/* Placeholder: no 404 copy in the handoff. */}
        <h1 id="page-title" className="type-h1" data-placeholder="copy">
          [Page not found: copy to come]
        </h1>
        <ButtonLink href={ROUTES.home}>Home</ButtonLink>
      </Container>
    </section>
  );
}
