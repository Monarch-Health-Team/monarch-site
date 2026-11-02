"use client";

import { useState, type FormEvent } from "react";

/*
 * Book an assessment form (lo-fi frame 12:1460, "Form card").
 * No submission backend in this build and no third-party services: submit
 * is intercepted and nothing leaves the browser. Bracketed text is a
 * labelled placeholder where the lo-fi frame has no copy yet.
 */
const FIELD =
  "mt-1.5 block w-full rounded-[10px] border border-line bg-white px-3.5 py-3 text-[16px] text-navy placeholder:text-muted focus-visible:border-navy";
const LABEL = "text-[14px] font-medium text-navy";

export function BookingForm() {
  const [attempted, setAttempted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
  }

  return (
    <form onSubmit={onSubmit} aria-labelledby="form-title" className="flex flex-col gap-5">
      <h2 id="form-title" className="type-h3 text-[22px]" data-placeholder="copy">
        [Form title to come]
      </h2>

      <fieldset>
        <legend className={LABEL}>Who is this for?</legend>
        <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2.5">
          {["Me", "A parent or relative", "A patient"].map((option) => (
            <label key={option} className="inline-flex cursor-pointer items-center gap-2 text-[15px] text-body">
              <input type="radio" name="who" value={option} className="size-4 accent-navy" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            Name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" className={FIELD} />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={FIELD} />
        </div>
        <div>
          <label htmlFor="phone" className={LABEL}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={FIELD} />
        </div>
        <div>
          <label htmlFor="area" className={LABEL}>
            Area
          </label>
          <input id="area" name="area" type="text" autoComplete="address-level2" className={FIELD} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          How can we help?
        </label>
        <textarea id="message" name="message" rows={5} className={`${FIELD} resize-y`} />
      </div>

      <p className="text-[14px] text-muted" data-placeholder="copy">
        [Form helper text to come]
      </p>

      {/* Consent / privacy wording must come from Julia and the privacy policy (handoff note 5). */}
      <label className="flex items-start gap-3 text-[14px] text-body" data-compliance="consent-placeholder">
        <input type="checkbox" name="consent" className="mt-0.5 size-4 shrink-0 accent-navy" />
        <span data-placeholder="copy">[Consent and privacy wording to come: Julia to provide]</span>
      </label>

      <div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-[12px] border-[1.5px] border-navy bg-navy px-[26px] py-[15px] text-[15px] font-semibold leading-none text-white hover:bg-[#001a54]"
        >
          Send message
        </button>
      </div>

      <p role="status" className="min-h-[1.5em] text-[14px] text-navy" data-placeholder="copy">
        {attempted ? "[Form sending is not connected in this build. Nothing was sent.]" : ""}
      </p>

      <p className="text-[14px] text-muted" data-placeholder="copy">
        [Note under the form to come]
      </p>
    </form>
  );
}
