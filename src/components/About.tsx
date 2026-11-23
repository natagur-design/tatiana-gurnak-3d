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

        {/* Placeholder for her portrait, opposite the heading. Swap this div
            for an <Image> once the photo is chosen. */}
        <div className={styles.photo} data-reveal="up" aria-hidden="true" />
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
