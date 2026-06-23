import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Analytics from "@/app/components/Analytics";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, ORG } from "@/lib/site";

const playfair = Playfair_Display({ variable: "--font-heading", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });

const OG_LOCALE = { en: "en_IN", hi: "hi_IN", mr: "mr_IN" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: SITE_NAME,
    robots: { index: true, follow: true },
    // Per-URL canonical + hreflang are emitted via the sitemap (app/sitemap.js),
    // which Google supports and which stays correct for every page. We deliberately
    // do NOT set page-specific alternates here, since a shared layout can't know the
    // child path and would otherwise point every sub-page's canonical at the home page.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}`,
      locale: OG_LOCALE[locale] || "en_IN",
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: ORG.name,
  legalName: ORG.legalName,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  foundingDate: ORG.foundingDate,
  email: ORG.email,
  telephone: ORG.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: ORG.address.streetAddress,
    addressLocality: ORG.address.addressLocality,
    addressRegion: ORG.address.addressRegion,
    postalCode: ORG.address.postalCode,
    addressCountry: ORG.address.addressCountry,
  },
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-emerald-700 focus:text-white">
            {t("skipToContent")}
          </a>
          <Navbar />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Analytics />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
