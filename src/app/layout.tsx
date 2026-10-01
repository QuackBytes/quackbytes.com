import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer, Header, Intro } from "@/components/site-shell";
import "./globals.css";

const outfit = localFont({
  src: "../../fonts/outfit-latin-wght-normal.woff2",
  variable: "--font-display",
  display: "swap",
});
const roboto = localFont({
  src: "../../fonts/roboto-latin-wght-normal.woff2",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quackbytes.com"),
  title: {
    default: "QuackBytes — Software for oddly specific problems.",
    template: "%s — QuackBytes",
  },
  description:
    "An independent software studio building focused internal tools, integrations, automation and web products for specific business needs. Small by design. Specific by nature.",
  openGraph: {
    title: "QuackBytes — Software for oddly specific problems.",
    description: "Purpose-built software. A little focus goes a long way.",
    siteName: "QuackBytes",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/qblogo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${roboto.variable}`}
      data-intro-pending="true"
      suppressHydrationWarning
    >
      <head>
        <style
          id="intro-critical-css"
          dangerouslySetInnerHTML={{
            __html: `html[data-intro-pending] body{overflow:hidden;background:#f5f3ec}html[data-intro-pending] body>*{visibility:hidden}html[data-intro-pending] .intro[hidden]{display:block;visibility:visible;position:fixed;inset:0;z-index:99}html[data-intro-pending] .intro-veil{position:absolute;inset:0;background:#f5f3ec}html[data-intro-pending] .pond-scene{visibility:visible}`,
          }}
        />
        <script
          id="intro-first-paint"
          dangerouslySetInnerHTML={{
            __html: `(()=>{const root=document.documentElement;try{if(location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("quackbytes-intro")){root.removeAttribute("data-intro-pending");return}setTimeout(()=>root.removeAttribute("data-intro-pending"),5000)}catch{root.removeAttribute("data-intro-pending")}})();`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Intro />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
