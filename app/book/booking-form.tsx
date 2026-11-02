"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ChevronDown, CircleAlert, LoaderCircle } from "lucide-react";
import { PhoneLink, buttonClasses } from "@/components/ui/actions";
import { cn } from "@/lib/cn";

/*
 * Book an assessment form, v2 (Figma 42:82 desktop, 60:556 mobile; v2 P0-3,
 * P1-11, P2-5).
 *
 * - Fields: 1px #8C8070 border, radius 8, 52px tall, 16px text; focus adds a
 *   2px #B23400 border on top of the global focus ring.
 * - "Who is this for?" as 56px radio cards with 20px radios; 24px checkbox.
 * - Required fields are marked; inline errors in #A3261B with an icon,
 *   linked by aria-describedby; an error summary at the top on submit.
 * - States: Sending… (aria-busy), a failed-send Alert, and a success panel
 *   that receives focus.
 *
 * There is no submission backend in this build and nothing leaves the
 * browser: `sendRequest` is a stub that reports "not sent", so a valid
 * submit shows the failed-send Alert. Do not make the form public until the
 * Privacy page and Julia's consent wording exist (v2 P0-7).
 */

type Fields = "who" | "name" | "phone" | "email" | "consent";
type Errors = Partial<Record<Fields, string>>;
type Status = "idle" | "sending" | "failed" | "sent";

const WHO = ["Me", "A parent or relative", "A patient I’m referring"];

// Service areas from the site copy ("Greater Victoria and Vancouver Island"). Options to be confirmed.
const AREAS = ["Greater Victoria", "Elsewhere on Vancouver Island"];

// Field order for the error summary and first-error focus.
const ORDER: { key: Fields; id: string; label: string }[] = [
  { key: "who", id: "who-0", label: "Who is this for?" },
  { key: "name", id: "name", label: "Name" },
  { key: "phone", id: "phone", label: "Phone" },
  { key: "email", id: "email", label: "Email" },
  { key: "consent", id: "consent", label: "Consent" },
];

const FIELD =
  "block h-[52px] w-full rounded-[8px] border bg-white px-4 text-[16px] text-navy placeholder:text-muted focus:border-2 focus:border-action focus:px-[15px]";
const LABEL = "text-[15px] font-medium leading-[1.3] text-navy";

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.get("who")) errors.who = "Choose who this is for.";
  if (!String(data.get("name") ?? "").trim()) errors.name = "Enter your name.";
  const digits = String(data.get("phone") ?? "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  if (digits.length !== 10) errors.phone = "Enter a 10-digit phone number, for example 250 555 0123.";
  const email = String(data.get("email") ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter an email address like name@example.com.";
  if (!data.get("consent")) errors.consent = "Tick the box to agree before sending your request.";
  return errors;
}

/** Stub: no backend is connected, so nothing is sent. */
async function sendRequest(): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 400));
  return false;
}

function Required() {
  return <span className="font-normal text-muted"> (required)</span>;
}

function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-[14px] font-medium leading-[1.4] text-error">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-[14px] shrink-0" strokeWidth={2} />
      <span>{children}</span>
    </p>
  );
}

export function BookingForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [who, setWho] = useState<string>("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const failedRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(new FormData(e.currentTarget));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setStatus("sending");
    const ok = await sendRequest();
    setStatus(ok ? "sent" : "failed");
    requestAnimationFrame(() => (ok ? successRef.current : failedRef.current)?.focus());
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-3">
        <h2 ref={successRef} tabIndex={-1} className="type-h3 text-[26px]">
          Thank you. We’ve received your request.
        </h2>
        <p className="text-[16px] text-body">
          We will contact you by phone or email to arrange a first conversation. If you would rather talk now, call <PhoneLink />.
        </p>
      </div>
    );
  }

  const errorList = ORDER.filter((f) => errors[f.key]);
  const described = (key: Fields, extra?: string) => cn(errors[key] && `${key}-error`, extra) || undefined;

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Book an assessment" aria-busy={status === "sending"} className="flex flex-col gap-6">
      {showSummary && errorList.length > 0 ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="error-summary-title" className="rounded-[8px] border-2 border-error bg-error-tint p-4 sm:p-5">
          <h2 id="error-summary-title" className="flex items-center gap-2 text-[16px] font-semibold text-error">
            <CircleAlert aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
            Check the highlighted fields
          </h2>
          <ul className="mt-2 flex flex-col gap-1 pl-7">
            {errorList.map((f) => (
              <li key={f.key}>
                <a href={`#${f.id}`} className="text-[15px] font-medium text-error underline underline-offset-4">
                  {errors[f.key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {status === "failed" ? (
        <div ref={failedRef} tabIndex={-1} role="alert" className="flex items-start gap-3 rounded-[8px] border border-error bg-error-tint p-4 sm:p-5">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-error" strokeWidth={2} />
          <p className="text-[15px] font-medium leading-[1.5] text-error">
            We couldn’t send your request. Please try again or call <PhoneLink />.
          </p>
        </div>
      ) : null}

      <fieldset aria-describedby={described("who")} aria-invalid={errors.who ? true : undefined} className="flex flex-col gap-2.5">
        <legend className={cn(LABEL, "mb-3")}>
          Who is this for?
          <Required />
        </legend>
        <div className="flex flex-col gap-2.5">
          {WHO.map((option, i) => (
            <label
              key={option}
              htmlFor={`who-${i}`}
              className={cn(
                "flex h-14 cursor-pointer items-center gap-3 rounded-[8px] border px-4 text-[15px] font-medium text-navy has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-navy",
                who === option ? "border-action bg-action-tint" : errors.who ? "border-error bg-white" : "border-field bg-white",
              )}
            >
              <input
                id={`who-${i}`}
                type="radio"
                name="who"
                value={option}
                checked={who === option}
                onChange={() => setWho(option)}
                className="size-5 shrink-0 accent-action focus-visible:outline-none"
              />
              {option}
            </label>
          ))}
        </div>
        <FieldError id="who-error">{errors.who}</FieldError>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={LABEL}>
            Name
            <Required />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={described("name")}
            className={cn(FIELD, errors.name ? "border-error" : "border-field")}
          />
          <FieldError id="name-error">{errors.name}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className={LABEL}>
            Phone
            <Required />
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={described("phone")}
            className={cn(FIELD, errors.phone ? "border-error" : "border-field")}
          />
          <FieldError id="phone-error">{errors.phone}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={LABEL}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={described("email")}
            className={cn(FIELD, errors.email ? "border-error" : "border-field")}
          />
          <FieldError id="email-error">{errors.email}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="area" className={LABEL}>
            Area
          </label>
          <div className="relative">
            <select id="area" name="area" defaultValue="" className={cn(FIELD, "appearance-none border-field pr-11")}>
              <option value="">Select an area</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 size-[18px] -translate-y-1/2 text-navy" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={LABEL}>
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          aria-describedby="message-help"
          className={cn(FIELD, "h-auto min-h-[120px] resize-y border-field py-3.5 focus:py-[13px]")}
        />
        <p id="message-help" className="text-[14px] leading-[1.4] text-muted">
          A sentence or two is plenty. Please don’t include medical details here; we’ll talk them through by phone.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {/* Consent wording from the v2 copy deck; needs the Privacy page before the form goes public. */}
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 py-2.5 text-[15px] leading-[1.55] text-body" data-compliance="consent">
          <input
            id="consent"
            type="checkbox"
            name="consent"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={described("consent")}
            className="mt-0.5 size-6 shrink-0 rounded-[4px] accent-action"
          />
          <span>
            I agree that Monarch Health may contact me by phone or email about this request, and I have read the Privacy Policy.
            <Required />
          </span>
        </label>
        <FieldError id="consent-error">{errors.consent}</FieldError>
      </div>

      <div>
        <button type="submit" disabled={status === "sending"} className={cn(buttonClasses("primary"), "group disabled:cursor-progress disabled:opacity-90")}>
          {status === "sending" ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" strokeWidth={2} />
              Sending…
            </>
          ) : (
            <>
              Send request
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none" strokeWidth={2} />
            </>
          )}
        </button>
      </div>

      <p className="text-[14px] leading-[1.55] text-muted">
        We will contact you by phone or email to arrange a first conversation. If you would rather talk now, call <PhoneLink />.
      </p>
    </form>
  );
}
