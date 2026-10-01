import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, Duck } from "@/components/brand";
import { Pond } from "@/components/pond";
import { Bites } from "@/components/bites";
import { getDictionary, hasLocale } from "./dictionaries";

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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const h = dict.home;
  return (
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span className="eyebrow">
            <span className="square-dot" /> {h.eyebrowTop}
          </span>
          <span className="eyebrow hero-side-note">{h.eyebrowSide}</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              {h.heroH1Pre}
              <br />
              <em>{h.heroH1Em}</em>
              <br />
              {h.heroH1Post}
              <span className="orange">.</span>
            </h1>
            <p>
              {h.leadLine1}
              <br />
              {h.leadLine2}
              <br />
              <strong>{h.leadStrong}</strong>
            </p>
            <Link className="button button-dark" href={`/${lang}/contact`}>
              {h.ctaPrimary} <Arrow diagonal />
            </Link>
          </div>
          <Pond pond={dict.pond} />
        </div>
        <div className="hero-bottom">
          <span>
            <Multiline text={h.bottomNote} />
          </span>
          <a href="#quick-bites" className="scroll-cue">
            {h.scrollCue} <span aria-hidden="true">↓</span>
          </a>
          <span className="hero-bottom-index">{h.bottomIndex}</span>
        </div>
      </section>

      <section id="quick-bites" className="manifesto">
        <div className="wrap manifesto-grid">
          <span className="eyebrow">{h.manifestoEyebrow}</span>
          <div>
            <h2>
              {h.manifestoH2Line1}
              <br />
              <span>
                {h.manifestoH2Pre} <em>{h.manifestoH2Em}</em>
              </span>
            </h2>
            <div className="manifesto-detail">
              <p>{h.manifestoP1}</p>
              <p>
                {h.manifestoP2Pre} <strong>{h.manifestoP2Strong}</strong>{" "}
                {h.manifestoP2Post}
              </p>
            </div>
            <Link className="text-link light-link" href={`/${lang}/studio`}>
              {h.manifestoLink} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="offerings wrap" aria-labelledby="offerings-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{h.offeringsEyebrow}</span>
            <h2 id="offerings-title">
              {h.offeringsH2Line1}
              <br />
              {h.offeringsH2Line2}
            </h2>
          </div>
          <p>
            <Multiline text={h.offeringsLead} />
          </p>
        </div>
        <Bites lang={lang} copy={dict.bites} />
      </section>

      <section className="contact-strip wrap">
        <Duck size={56} />
        <div>
          <span className="eyebrow">{h.contactStripEyebrow}</span>
          <h2>
            {h.contactStripH2Line1}
            <br />
            {h.contactStripH2Line2}
          </h2>
          <p>{h.contactStripP}</p>
        </div>
        <Link className="button button-orange" href={`/${lang}/contact`}>
          {h.contactStripCta} <Arrow diagonal />
        </Link>
      </section>
    </main>
  );
}
