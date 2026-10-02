import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Footer, Header, Intro } from "@/components/site-shell";
import {
  getDictionary,
  hasLocale,
  hreflangLanguages,
  locales,
  type Locale,
} from "./dictionaries";
import "../globals.css";

const outfit = localFont({
  src: "../../../fonts/outfit-latin-wght-normal.woff2",
  variable: "--font-display",
  display: "swap",
});
const roboto = localFont({
  src: "../../../fonts/roboto-latin-wght-normal.woff2",
  variable: "--font-body",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
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
    metadataBase: new URL("https://quackbytes.com"),
    title: {
      default: dict.meta.defaultTitle,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.siteDescription,
    alternates: {
      canonical: `/${lang}`,
      languages: hreflangLanguages(),
    },
    openGraph: {
      title: dict.meta.defaultTitle,
      description: dict.meta.ogDescription,
      siteName: "QuackBytes",
      locale: dict.meta.ogLocale,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/brand/qblogo.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${roboto.variable}`}
      data-intro-pending="true"
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-first-paint"
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const saved=localStorage.getItem("quackbytes-theme");const theme=saved==="light"||saved==="dark"?saved:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{}})();`,
          }}
        />
        <style
          id="intro-critical-css"
          dangerouslySetInnerHTML={{
            __html: `html[data-intro-pending] body{overflow:hidden;background:var(--paper)}html[data-intro-pending] body>*{visibility:hidden}html[data-intro-pending] .intro[hidden]{display:block;visibility:visible;position:fixed;inset:0;z-index:99}html[data-intro-pending] .intro-veil{position:absolute;inset:0;background:var(--paper)}html[data-intro-pending] .pond-scene{visibility:visible}`,
          }}
        />
        <script
          id="intro-first-paint"
          dangerouslySetInnerHTML={{
            __html: `(()=>{const root=document.documentElement;try{if(!/^\\/(tr|en)\\/?$/.test(location.pathname)||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("quackbytes-intro")){root.removeAttribute("data-intro-pending");return}setTimeout(()=>root.removeAttribute("data-intro-pending"),5000)}catch{root.removeAttribute("data-intro-pending")}})();`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {dict.common.skipLink}
        </a>
        <Intro lang={locale} />
        <Header lang={locale} nav={dict.nav} />
        {children}
        <Footer lang={locale} nav={dict.nav} footer={dict.footer} />
      </body>
    </html>
  );
}
