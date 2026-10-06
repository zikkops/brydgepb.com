import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { CONTACT } from "@/data/products";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about an order, wholesale or partnerships? Get in touch with Brydge.",
};

export default function ContactPage() {
  // PLACEHOLDER contact details (src/data/products.ts CONTACT)
  const channels = [
    { label: "WhatsApp", value: CONTACT.phone, href: `https://wa.me/${CONTACT.whatsapp}`, bg: "bg-matcha", fg: "text-espresso" },
    { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, bg: "bg-almond", fg: "text-espresso" },
    { label: "Instagram", value: `@${CONTACT.instagram}`, href: `https://instagram.com/${CONTACT.instagram}`, bg: "bg-strawberry", fg: "text-paper" },
  ];

  return (
    <>
      <PageIntro eyebrow="Contact us" title="Let's talk." lead="Questions about an order, bulk boxes for your gym or office, or just want to tell us your favourite flavour? We read everything." />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[2rem] bg-paper p-6 sm:p-10">
          <ContactForm />
        </div>
        <Reveal className="space-y-4" stagger={0.1}>
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={`grain group flex items-center justify-between gap-4 rounded-[2rem] p-6 transition-[translate] duration-300 hover:-translate-y-1 ${c.bg} ${c.fg}`}
            >
              <span className="min-w-0">
                <span className="eyebrow block opacity-80">{c.label}</span>
                <span className="display mt-2 block break-words text-2xl normal-case sm:text-3xl">{c.value}</span>
              </span>
              <span aria-hidden className="text-3xl transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          ))}
          <div className="rounded-[2rem] border-2 border-espresso p-6">
            <span className="eyebrow block text-espresso-soft">Based in</span>
            <span className="display mt-2 block text-2xl">{CONTACT.area}</span>
            <p className="mt-2 text-sm text-espresso-soft">Delivering across Lebanon, cash on delivery.</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
