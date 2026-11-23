import { getTranslations } from "next-intl/server";
import { contacts } from "@/config/contacts";
import { Link } from "@/i18n/navigation";
import styles from "./Footer.module.css";

// Thin-line icons, 24 x 24, drawn with the current text colour.
const ICONS = {
  whatsapp: (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <g transform="translate(7.6 7.4) scale(0.37)">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
    </>
  ),
  telegram: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </>
  ),
  email: (
    <>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
} as const;

type Props = {
  /** Prefix for the section links when the footer sits on another page. */
  base?: string;
};

export default async function Footer({ base = "" }: Props) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const links = [
    { key: "whatsapp", href: contacts.whatsapp, label: t("whatsapp") },
    { key: "telegram", href: contacts.telegram, label: t("telegram") },
    {
      key: "email",
      href: contacts.email ? `mailto:${contacts.email}` : "",
      label: t("email"),
    },
    { key: "instagram", href: contacts.instagram, label: t("instagram") },
  ].filter(
    // The email icon stays on show even before an address exists; it simply
    // does not link anywhere yet. Telegram stays hidden until it is set.
    (link) => link.href || link.key === "email",
  ) as {
    key: keyof typeof ICONS;
    href: string;
    label: string;
  }[];

  return (
    <footer id="contact" className={styles.footer}>
      <h2 className={styles.heading} data-reveal="left">
        {t("heading")}
      </h2>

      <div className={styles.contact}>
        <p className={styles.intro} data-reveal="up">
          {t("intro")}
        </p>

        <ul className={styles.icons} data-reveal="up">
          {links.map((link) => {
            const icon = (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ICONS[link.key]}
              </svg>
            );
            return (
              <li key={link.key}>
                {link.href ? (
                  <a
                    href={link.href}
                    className={styles.icon}
                    aria-label={link.label}
                    title={link.label}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {icon}
                  </a>
                ) : (
                  // No address yet: shown, but not a link.
                  <span className={`${styles.icon} ${styles.idle}`} title={link.label}>
                    {icon}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.bottom}>
        <nav className={`tiny ${styles.menu}`} aria-label={t("menu")}>
          <a href={`${base}#projects`}>{nav("projects")}</a>
          <a href={`${base}#services`}>{nav("services")}</a>
          <a href={`${base}#about`}>{nav("about")}</a>
        </nav>

        <a href="#" className={`tiny ${styles.top}`}>
          {t("top")} ↑
        </a>

        <p className={styles.legal}>
          <Link href="/privacy">{t("privacy")}</Link>
        </p>
      </div>
    </footer>
  );
}
