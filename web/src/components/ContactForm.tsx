"use client";

import { startTransition, useActionState } from "react";
import { sendContactMessage, type ActionResult } from "@/app/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(sendContactMessage, null);

  if (state?.ok) {
    return (
      <div role="status" className="py-12 text-center">
        <p className="display text-4xl">Message sent.</p>
        <p className="mt-3 text-espresso-soft">Thanks for writing. We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    // startTransition instead of <form action>, so an error doesn't clear the message.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-5"
    >
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">Name</label>
          <input id="c-name" name="name" required autoComplete="name" className="field" maxLength={200} />
        </div>
        <div>
          <label htmlFor="c-email" className="label">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className="field" maxLength={200} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-phone" className="label">Phone <span className="normal-case tracking-normal opacity-60">(optional)</span></label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="field" maxLength={30} />
        </div>
        <div>
          <label htmlFor="c-subject" className="label">Subject</label>
          <select id="c-subject" name="subject" required className="field" defaultValue="">
            <option value="" disabled>Choose one</option>
            <option>An order</option>
            <option>Bulk / wholesale</option>
            <option>Partnership</option>
            <option>Something else</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="label">Message</label>
        <textarea id="c-message" name="message" required rows={6} className="field" maxLength={5000} />
      </div>
      {state && !state.ok && <p role="alert" className="rounded-2xl bg-strawberry px-4 py-3 text-sm text-paper">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-dark w-full sm:w-auto">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
