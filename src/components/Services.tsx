import { getTranslations } from "next-intl/server";
import styles from "./Services.module.css";

const IDS = ["visualization", "furniture", "modeling", "design", "panoramas", "drawings"] as const;

export default async function Services() {
  const t = await getTranslations("services");

  return (
    <section id="services" className={styles.section}>
      <h2 className={`tiny ${styles.label}`} data-reveal="slow">
        {t("heading")}
      </h2>

      <ul className={styles.list}>
        {IDS.map((id) => (
          <li key={id} className={styles.row} data-reveal="slow">
            <h3 className={styles.title}>{t(`items.${id}.title`)}</h3>
            <p className={styles.text}>{t(`items.${id}.text`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
