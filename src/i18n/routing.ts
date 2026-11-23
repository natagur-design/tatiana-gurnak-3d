import { defineRouting } from "next-intl/routing";

// Languages: English (default), Russian and Ukrainian. Texts live in
// messages/<locale>.json. A new language needs its own file here, an entry
// in LOCALE_LABELS and, for Cyrillic or other scripts, a font in the layout.
export const routing = defineRouting({
  locales: ["en", "ru", "uk"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = { en: "EN", ru: "RU", uk: "UK" };
