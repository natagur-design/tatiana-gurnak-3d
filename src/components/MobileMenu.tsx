"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./MobileMenu.module.css";

// Gives the page its scrolling back (the open sheet holds it still).
function releaseScroll() {
  document.documentElement.style.overflow = "";
}

type Item = { label: string; href: string; external?: boolean };

type Props = {
  items: Item[];
  openLabel: string;
  closeLabel: string;
};

// The phone menu: three lines in the header that open a frosted sheet with
// every link of the site. Shown only on narrow screens (see the CSS).
export default function MobileMenu({ items, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // While the sheet is open the header turns dark on it, the page behind
  // does not scroll, and Esc closes it.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!open) {
      header?.removeAttribute("data-menu");
      return;
    }
    header?.setAttribute("data-menu", "open");
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
    };
  }, [open, close]);

  // Back to the wide layout: the sheet makes no sense there.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 761px)");
    const onChange = () => query.matches && close();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [close]);

  // Links to a section of this page: close the sheet first, then scroll
  // (the page cannot scroll while the sheet holds it still).
  const follow = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    close();
    if (!href.startsWith("#")) return;
    event.preventDefault();
    releaseScroll();
    const target = document.getElementById(href.slice(1));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    });
  };

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? closeLabel : openLabel}
        data-open={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {open
        ? createPortal(
            <nav id="site-menu" className={styles.sheet} aria-label="Menu">
              <ul className={styles.links}>
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => follow(event, item.href)}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <LanguageSwitcher className={`tiny ${styles.language}`} />
            </nav>,
            document.body,
          )
        : null}
    </>
  );
}
