import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, Next internals, and files with an
  // extension (sitemap.xml, robots.txt, favicon.ico, images, etc.).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
