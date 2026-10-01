type EnDictionary = typeof import("./dictionaries/en.json");
export type Dictionary = EnDictionary;

export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  tr: () => import("./dictionaries/tr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

export const getDictionary = (locale: Locale) => dictionaries[locale]();

export const otherLocale = (locale: Locale): Locale =>
  locale === "tr" ? "en" : "tr";

/** hreflang alternates for a route path shared across locales (e.g. "" or "/studio"). */
export function hreflangLanguages(path = "") {
  return {
    tr: `/tr${path}`,
    en: `/en${path}`,
    "x-default": `/tr${path}`,
  };
}
