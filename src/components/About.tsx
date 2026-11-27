import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./About.module.css";

const TERMS = ["prepayment", "revisions", "renders"] as const;

export default async function About() {
  const t = await getTranslations("about");

  return (
    <section id="about" className={styles.section}>
      <div className={styles.top}>
        <h2 className={styles.heading} data-reveal="left">
          {t("heading")}
        </h2>

        <div className={styles.photo} data-reveal="up">
          <Image
            src="/images/about.jpg"
            alt={t("photoAlt")}
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
          />
        </div>
      </div>

      <div className={styles.columns}>
        <p className={styles.text} data-reveal="up">
          {t("text")}
        </p>

        <div data-reveal="up">
          <dl className={styles.tools}>
            <dt className="tiny">{t("toolsLabel")}</dt>
            <dd>{t("tools")}</dd>
          </dl>

          <ul className={styles.terms}>
            {TERMS.map((id) => (
              <li key={id}>{t(`terms.${id}`)}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
