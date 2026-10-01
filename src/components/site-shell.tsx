"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export { Intro } from "./intro";
import { Arrow, Duck } from "./brand";

type Nav = {
  home: string;
  studio: string;
  contact: string;
  switchLabel: string;
  switchAria: string;
};

type FooterCopy = {
  tagline: string;
  location: string;
  replay: string;
};

export function Header({ lang, nav }: { lang: string; nav: Nav }) {
  const pathname = usePathname();
  const other = lang === "tr" ? "en" : "tr";
  const switchHref = pathname.replace(/^\/(tr|en)/, `/${other}`) || `/${other}`;
  const home = `/${lang}`;
  const studio = `/${lang}/studio`;
  const contact = `/${lang}/contact`;
  return (
    <header className="site-header wrap">
      <Link className="wordmark" href={home} aria-label="QuackBytes home">
        <Duck size={39} />
        <span>
          quackbytes<span className="wordmark-dot">.</span>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href={home} aria-current={pathname === home ? "page" : undefined}>
          {nav.home}
        </Link>
        <Link
          href={studio}
          aria-current={pathname === studio ? "page" : undefined}
        >
          {nav.studio}
        </Link>
        <Link
          className="nav-contact"
          href={contact}
          aria-current={pathname === contact ? "page" : undefined}
        >
          {nav.contact} <Arrow diagonal />
        </Link>
        <Link
          className="lang-switch"
          href={switchHref}
          hrefLang={other}
          aria-label={nav.switchAria}
        >
          {nav.switchLabel}
        </Link>
      </nav>
    </header>
  );
}

export function Footer({
  lang,
  footer,
}: {
  lang: string;
  nav: Nav;
  footer: FooterCopy;
}) {
  return (
    <footer className="site-footer wrap">
      <div className="footer-top">
        <Link className="wordmark" href={`/${lang}`}>
          <Duck size={32} />
          <span>quackbytes.</span>
        </Link>
        <p>{footer.tagline}</p>
        <a className="footer-email" href="mailto:hello@quackbytes.com">
          hello@quackbytes.com <Arrow diagonal />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} QuackBytes</span>
        <span>{footer.location}</span>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("quackbytes:replay"))}
        >
          {footer.replay} <span aria-hidden="true">↺</span>
        </button>
      </div>
    </footer>
  );
}
