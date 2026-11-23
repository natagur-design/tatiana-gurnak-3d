"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALE_LABELS, routing } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

// EN / RU / UK. Each link leads to the same page in the other language.
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const current = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <ul className={`${styles.list} ${className}`} aria-label={t("language")}>
      {routing.locales.map((locale) => (
        <li key={locale}>
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            className={styles.link}
            aria-current={locale === current ? "true" : undefined}
          >
            {LOCALE_LABELS[locale]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
