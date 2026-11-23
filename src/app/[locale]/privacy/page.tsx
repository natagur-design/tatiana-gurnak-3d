import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./privacy.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title"), robots: { index: false } };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as { heading: string; text: string }[];

  return (
    <>
      <Header solid base={`/${locale}`} />
      <main className={styles.page}>
        <Link href="/" className={`tiny ${styles.back}`}>
          ← {t("back")}
        </Link>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.updated}>{t("updated")}</p>

        <div className={styles.body}>
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer base={`/${locale}`} />
    </>
  );
}
