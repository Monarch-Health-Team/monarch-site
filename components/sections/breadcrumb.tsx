import Link from "next/link";
import { ROUTES } from "@/lib/site";

/** Breadcrumb: Inter Medium 13, #6B6157 ("Home  /  Page"). */
export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-muted">
        <li>
          <Link href={ROUTES.home} className="hover:text-navy hover:underline underline-offset-4">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
