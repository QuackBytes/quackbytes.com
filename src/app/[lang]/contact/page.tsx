import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { Arrow } from "@/components/brand";
import { getDictionary, hasLocale, hreflangLanguages } from "../dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: hreflangLanguages("/contact"),
    },
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const c = dict.contact;
  return (
    <main id="main" className="contact-page wrap">
      <div className="contact-intro">
        <span className="eyebrow">
          <span className="square-dot" /> {c.eyebrow}
        </span>
        <h1>
          {c.h1Pre}
          <br />
          <em>{c.h1Em}</em>
          <br />
          {c.h1Post}
          <span className="orange">?</span>
        </h1>
        <p>{c.lead}</p>
        <a className="contact-email" href="mailto:hello@quackbytes.com">
          hello@quackbytes.com <Arrow diagonal />
        </a>
        <div className="contact-note">
          <span className="handwritten">{c.noteHandwritten}</span>
          <p>{c.noteP}</p>
        </div>
      </div>
      <Suspense
        fallback={<div className="contact-form">{c.fallback}</div>}
      >
        <ContactForm form={dict.form} />
      </Suspense>
    </main>
  );
}
