"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { projects, type Project } from "@/data/projects";
import { coverSizes } from "@/lib/imageSizes";
import { useRowScroll } from "@/lib/useRowScroll";
import GalleryDialog from "./GalleryDialog";
import styles from "./Projects.module.css";

export default function Projects() {
  const t = useTranslations("projects");
  const track = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  // Opened with the keyboard? Then focus goes back to the card with its ring.
  // Opened with a mouse or a finger: no ring should be left behind.
  const byKeyboard = useRef(false);
  const { bar, step, rowProps, lineProps } = useRowScroll(track);

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.layout}>
        {/* The arrival animation moves the heading; the turning of the word is
            on the span inside, so the two never mix (otherwise the word can
            stay upside down after the window is narrowed or a phone turned). */}
        <h2 className={styles.label} data-reveal="side">
          <span className={styles.labelText}>{t("heading")}</span>
        </h2>

        <div className={styles.main}>
          <ul
            ref={track}
            className={styles.track}
            {...rowProps}
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
                      sizes={coverSizes(project.images[0])}
                      quality={85}
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
            <div className={styles.line} {...lineProps} aria-hidden="true">
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
