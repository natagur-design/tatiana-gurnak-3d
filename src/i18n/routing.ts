import { defineRouting } from "next-intl/routing";

// English only for now. The Russian and Ukrainian texts are kept in
// messages/_later/ and can be brought back by adding "ru" and "uk" here,
// moving the files back to messages/ and re-adding a language switcher.
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
