import { defineRouting } from "next-intl/routing";

// Languages: English (default), Russian and Ukrainian. Texts live in
// messages/<locale>.json. A new language needs its own file here, an entry
// in LOCALE_LABELS and, for Cyrillic or other scripts, a font in the layout.
export const routing = defineRouting({
  locales: ["en", "ru", "uk"],
  defaultLocale: "en",
  localePrefix: "always",
  // The site always opens in English, whatever the browser's language is.
  // Other languages are chosen with the switch in the header. No cookie is
  // stored (the privacy policy promises that).
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = { en: "EN", ru: "RU", uk: "UK" };
