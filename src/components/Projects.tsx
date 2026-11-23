"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { projects, type Project } from "@/data/projects";
import GalleryDialog from "./GalleryDialog";
import styles from "./Projects.module.css";

export default function Projects() {
  const t = useTranslations("projects");
  const track = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  // Opened with the keyboard? Then focus goes back to the card with its ring.
  // Opened with a mouse or a finger: no ring should be left behind.
  const byKeyboard = useRef(false);
  // Where the thin progress line's thumb sits, as fractions of the line.
  const [bar, setBar] = useState({ size: 0.4, offset: 0 });

  const update = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const size = Math.min(1, el.clientWidth / el.scrollWidth);
    setBar({ size, offset: max > 0 ? (el.scrollLeft / max) * (1 - size) : 0 });
  };

  const step = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const width = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * width, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.layout}>
        <h2 className={styles.label} data-reveal="side">
          {t("heading")}
        </h2>

        <div className={styles.main}>
          <ul
            ref={track}
            className={styles.track}
            onScroll={update}
            tabIndex={0}
            aria-label={t("heading")}
          >
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  className={styles.card}
                  aria-haspopup="dialog"
                  onClick={(event) => {
                    byKeyboard.current = event.detail === 0;
                    setOpen(project);
                  }}
                >
                  <span className={styles.frame} data-reveal="up">
                    <Image
                      src={project.images[0].src}
                      alt=""
                      fill
                      sizes="(min-width: 900px) 22vw, 60vw"
                      className={styles.image}
                    />
                  </span>
                  <span className={styles.name}>{t(`items.${project.id}.title`)}</span>
                  <span className={styles.kind}>{t(`items.${project.id}.kind`)}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.controls}>
            <div className={styles.line} aria-hidden="true">
              <span
                className={styles.thumb}
                style={{
                  width: `${bar.size * 100}%`,
                  marginLeft: `${bar.offset * 100}%`,
                }}
              />
            </div>
            <div className={`tiny ${styles.arrows}`}>
              <button type="button" onClick={() => step(-1)} aria-label={t("previous")}>
                ←
              </button>
              <button type="button" onClick={() => step(1)} aria-label={t("next")}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <GalleryDialog
          project={open}
          next={projects[(projects.indexOf(open) + 1) % projects.length]}
          onNext={() => setOpen(projects[(projects.indexOf(open) + 1) % projects.length])}
          onClose={() => {
            setOpen(null);
            if (!byKeyboard.current) {
              setTimeout(() => {
                const active = document.activeElement;
                if (active instanceof HTMLElement) active.blur();
              }, 0);
            }
          }}
        />
      ) : null}
    </section>
  );
}
