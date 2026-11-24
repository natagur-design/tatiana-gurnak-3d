import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
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
        <a href={`${base}#contact`}>{nav("contact")}</a>
      </nav>

      <Link href="/" className={styles.brand}>
        {brand("name")}
      </Link>

      <div className={styles.right}>
        <LanguageSwitcher className={styles.lang} />
      </div>

      <MobileMenu
        items={[
          { label: nav("projects"), href: `${base}#projects` },
          { label: nav("services"), href: `${base}#services` },
          { label: nav("about"), href: `${base}#about` },
          { label: nav("contact"), href: `${base}#contact` },
        ]}
        openLabel={nav("menu")}
        closeLabel={nav("closeMenu")}
      />
    </header>
  );
}
