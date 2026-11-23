import { getTranslations } from "next-intl/server";
import { contacts } from "@/config/contacts";
import { Link } from "@/i18n/navigation";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

type Props = {
  /** Frosted from the start, for pages without the photo hero. */
  solid?: boolean;
  /** Prefix for the section links when the header sits on another page. */
  base?: string;
};

export default async function Header({ solid = false, base = "" }: Props) {
  const nav = await getTranslations("nav");
  const brand = await getTranslations("brand");

  return (
    <header
      className={`tiny ${styles.header}`}
      data-site-header
      data-solid={solid ? "true" : "false"}
    >
      <nav className={styles.left} aria-label="Main">
        <a href={`${base}#projects`}>{nav("projects")}</a>
        <a href={`${base}#services`}>{nav("services")}</a>
        <a href={`${base}#about`}>{nav("about")}</a>
      </nav>

      <Link href="/" className={styles.brand}>
        {brand("name")}
      </Link>

      <div className={styles.right}>
        <a href={`${base}#contact`}>{nav("contact")}</a>
        <a href={contacts.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>

      <MobileMenu
        items={[
          { label: nav("projects"), href: `${base}#projects` },
          { label: nav("services"), href: `${base}#services` },
          { label: nav("about"), href: `${base}#about` },
          { label: nav("contact"), href: `${base}#contact` },
          { label: "Instagram", href: contacts.instagram, external: true },
        ]}
        openLabel={nav("menu")}
        closeLabel={nav("closeMenu")}
      />
    </header>
  );
}
