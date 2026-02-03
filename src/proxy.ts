import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n, LanguageType, Locale } from "./i18n.config";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { Pages, Routes } from "./constants/enums";
import { UserRole } from "./generated/prisma";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: LanguageType[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  let locale = "";

  try {
    locale = matchLocale(languages, locales, i18n.defaultLocale);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    locale = i18n.defaultLocale;
  }
  return locale;
}

export default withAuth(
  async function proxy(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    const pathname = request.nextUrl.pathname;

    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) => !pathname.startsWith(`/${locale}`)
    );

    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url)
      );
    }

    const currentLang = request.url.split("/")[3] as Locale;
    const isAuth = await getToken({ req: request });
    const isAuthPage = pathname.startsWith(`/${currentLang}/${Routes.AUTH}`);
    const protectedRoutes = [Routes.PROFILE, Routes.ADMIN];
    const isAdminPage = pathname.startsWith(`/${currentLang}/${Routes.ADMIN}`);

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(`/${currentLang}/${route}`)
    );

    // Redirect to login page if user is not authenticated and the route is protected
    if (isProtectedRoute && !isAuth) {
      return NextResponse.redirect(
        new URL(`/${currentLang}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
      );
    }

    // Redirect to home page if user is authenticated and the route is auth page
    if (isAuthPage && isAuth) {
      const role = isAuth?.role
      if(role === UserRole.ADMIN) {
        return NextResponse.redirect(
          new URL(`/${currentLang}/${Routes.ADMIN}`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(`/${currentLang}/${Routes.PROFILE}`, request.url)
      );
    }

    // Redirect to admin page if user is authenticated and the route is admin page
    if(isAuth && isAdminPage ) {
      const role = isAuth?.role
      // console.log('role',role)
      if(role !== UserRole.ADMIN) {
        return NextResponse.redirect(
          new URL(`/${currentLang}/${Routes.PROFILE}`, request.url)
        );
      } 
  
    }

    return response;
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, ..etc
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
