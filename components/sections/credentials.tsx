import { House, MapPin, ShieldCheck, Stethoscope } from "lucide-react";
import { DirectionsLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/layout";
import { CREDENTIALS } from "@/lib/site";
import { cn } from "@/lib/cn";

/* Hairlines per cell: stacked rows (mobile), 2 × 2 (sm), 4 columns (lg). */
const CELL = [
  "lg:pl-0",
  "border-t sm:border-t-0 sm:border-l sm:pl-6 lg:pl-6",
  "border-t lg:border-t-0 lg:border-l",
  "border-t sm:border-l sm:pl-6 lg:border-t-0 lg:pl-6",
];

const ICONS = { shield: ShieldCheck, stethoscope: Stethoscope, pin: MapPin, home: House } as const;

/*
 * Credentials band (v2 P1-4), under every hero: four columns split by 1px
 * hairlines (top, bottom and between), 24px navy icons, Semi Bold 15 navy
 * label and a muted 14px second line; the address cell adds "Get directions"
 * (Doc §13 Decision 1). Stacked rows on mobile.
 */
export function CredentialsBand() {
  return (
    <section aria-label="Credentials" className="bg-cream pb-14 lg:pb-0">
      <Container>
        <ul className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {CREDENTIALS.map((item, i) => {
            const { icon, label, detail } = item;
            const Icon = ICONS[icon];
            return (
              <li
                key={label}
                className={cn("flex items-start gap-3.5 border-line py-4 lg:gap-4 lg:px-6 lg:py-7", CELL[i])}
              >
                <Icon aria-hidden="true" className="size-[22px] shrink-0 text-navy lg:size-6" strokeWidth={1.5} />
                <div className="flex flex-col gap-1">
                  <p className="text-[15px] font-semibold leading-[1.3] text-navy">{label}</p>
                  <p className="text-[14px] leading-[1.4] text-muted">{detail}</p>
                  {"directions" in item ? <DirectionsLink className="-my-1.5 self-start" /> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
