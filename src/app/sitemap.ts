import type { MetadataRoute } from "next";

const base = "https://quackbytes.com";
const paths = ["", "/studio", "/contact"];
const locales = ["tr", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
      alternates: {
        languages: {
          tr: `${base}/tr${path}`,
          en: `${base}/en${path}`,
          "x-default": `${base}/tr${path}`,
        },
      },
    })),
  );
}
