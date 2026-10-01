import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, Duck } from "@/components/brand";
import { getDictionary, hasLocale, hreflangLanguages } from "../dictionaries";

function Multiline({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.studioTitle,
    description: dict.meta.studioDescription,
    alternates: {
      canonical: `/${lang}/studio`,
      languages: hreflangLanguages("/studio"),
    },
  };
}

export default async function Studio({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const s = dict.studio;
  return (
    <main id="main">
      <section className="studio-hero wrap">
        <span className="eyebrow">
          <span className="square-dot" /> {s.heroEyebrow}
        </span>
        <h1>
          {s.heroH1Pre}
          <br />
          <em>{s.heroH1Em}</em>
        </h1>
        <div className="studio-intro">
          <div className="studio-stamp">
            <Duck size={76} />
            <span>
              {s.stampLine1}
              <br />
              {s.stampLine2}
            </span>
          </div>
          <p>{s.introP1}</p>
          <p>{s.introP2}</p>
        </div>
      </section>

      <section className="name-story">
        <div className="wrap story-grid">
          <div>
            <span className="eyebrow">{s.nameEyebrow}</span>
            <h2>
              {s.nameH2Line1}
              <br />
              {s.nameH2Pre}
              <span className="orange">{s.nameH2Orange}</span>
            </h2>
            <span className="handwritten">{s.handwritten}</span>
          </div>
          <div className="story-copy">
            <p className="large-copy">
              <Multiline text={s.storyLarge} />
            </p>
            <p>{s.storyP1}</p>
            <p>{s.storyP2}</p>
          </div>
        </div>
      </section>

      <section className="principles wrap">
        <span className="eyebrow">{s.principlesEyebrow}</span>
        <div className="principle">
          <span className="principle-number">01</span>
          <h3>
            {s.principle1Line1}
            <br />
            {s.principle1Line2}
          </h3>
          <p>{s.principle1P}</p>
        </div>
        <div className="principle">
          <span className="principle-number">02</span>
          <h3>
            {s.principle2Line1}
            <br />
            {s.principle2Line2}
          </h3>
          <p>{s.principle2P}</p>
        </div>
        <div className="principle">
          <span className="principle-number">03</span>
          <h3>
            {s.principle3Line1}
            <br />
            {s.principle3Line2}
          </h3>
          <p>{s.principle3P}</p>
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{s.processEyebrow}</span>
              <h2>
                {s.processH2Line1}
                <br />
                {s.processH2Line2}
              </h2>
            </div>
            <p>
              <Multiline text={s.processLead} />
            </p>
          </div>
          <ol className="process-list">
            {s.steps.map((step) => (
              <li key={step.label}>
                <span>{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="studio-cta wrap">
        <span className="eyebrow">{s.ctaEyebrow}</span>
        <h2>
          {s.ctaH2Pre}
          <br />
          <em>{s.ctaH2Em}</em>
        </h2>
        <Link className="button button-dark" href={`/${lang}/contact`}>
          {s.ctaButton} <Arrow diagonal />
        </Link>
      </section>
    </main>
  );
}
