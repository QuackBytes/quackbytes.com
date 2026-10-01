import { NextResponse, type NextRequest } from "next/server";

const locales = ["tr", "en"] as const;
const defaultLocale = "tr";

function detectLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.toLowerCase(), quality: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.quality - a.quality);
    for (const { tag } of ranked) {
      const base = tag.split("-")[0];
      if ((locales as readonly string[]).includes(base)) return base;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) {
    // Expose the active locale so the not-found boundary can localize itself.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", pathname.split("/")[1]);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals and any file with an extension (metadata routes, assets).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
