import Link from "next/link";
import { ROUTES } from "@/lib/site";

/** Breadcrumb (v2): Inter 13, muted "Home", "/", current page in navy Medium. */
export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] leading-[1.4] text-muted">
        <li>
          <Link href={ROUTES.home} className="inline-flex min-h-6 items-center hover:text-navy hover:underline underline-offset-4">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page" className="font-medium text-navy">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
