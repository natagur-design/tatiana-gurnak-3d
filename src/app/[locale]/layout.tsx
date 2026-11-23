import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, Instrument_Serif, Noto_Serif_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteUrl } from "@/config/contacts";
import { routing } from "@/i18n/routing";
import "../globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Instrument Serif and Hanken Grotesk have no Cyrillic letters. Russian and
// Ukrainian pages use these two instead (see the :lang rule in globals.css).
// They are not preloaded: the browser fetches them only when Cyrillic text
// is on the page.
const cyrillicSerif = Noto_Serif_Display({
  subsets: ["cyrillic", "latin"],
  axes: ["wdth"],
  variable: "--font-cyr-serif",
  display: "swap",
  preload: false,
});

const cyrillicSans = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-cyr-sans",
  display: "swap",
  preload: false,
});

const OG_LOCALES: Record<string, string> = { en: "en_US", ru: "ru_RU", uk: "uk_UA" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const brand = await getTranslations({ locale, namespace: "brand" });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}`]));

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}` },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: brand("name"),
      title: t("title"),
      description: t("description"),
      locale: OG_LOCALES[locale],
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${instrument.variable} ${hanken.variable} ${cyrillicSerif.variable} ${cyrillicSans.variable}`}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
