import Link from "next/link";
import { headers } from "next/headers";
import { Duck, Arrow } from "@/components/brand";
import { getDictionary, hasLocale, defaultLocale } from "./dictionaries";

export default async function NotFound() {
  const current = (await headers()).get("x-locale") ?? "";
  const locale = hasLocale(current) ? current : defaultLocale;
  const dict = await getDictionary(locale);
  const n = dict.notFound;
  return (
    <main id="main" className="not-found wrap">
      <Duck size={90} />
      <span className="eyebrow">{n.eyebrow}</span>
      <h1>
        {n.h1Pre}
        <br />
        <em>{n.h1Em}</em>
      </h1>
      <p>{n.p}</p>
      <Link className="button button-dark" href={`/${locale}`}>
        {n.button} <Arrow />
      </Link>
    </main>
  );
}
