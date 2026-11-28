"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { nextSizes, slideSizes, viewerSizes } from "@/lib/imageSizes";
import { useRowScroll } from "@/lib/useRowScroll";
import styles from "./GalleryDialog.module.css";

gsap.registerPlugin(useGSAP);

// A photo fades in once it has loaded, so it never pops onto the page.
const loaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.dataset.loaded = "true";
};

type Props = {
  project: Project;
  /** The project that follows this one; it closes the row as a last card. */
  next: Project;
  onNext: () => void;
  onClose: () => void;
};

// A project opens as a page of its own: title and text, then its photos in a
// row you scroll sideways (same line and arrows as the Projects strip), and
// the next project as the last card of that row.
export default function GalleryDialog({ project, next, onNext, onClose }: Props) {
  const t = useTranslations("gallery");
  const tp = useTranslations("projects");
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const { bar, update, step, rowProps, lineProps } = useRowScroll(track);
  // Index of the photo shown at full size, or null.
  const [zoom, setZoom] = useState<number | null>(null);
  const touchX = useRef(0);
  const title = tp(`items.${project.id}.title`);
  const total = project.images.length;

  // The native <dialog> gives us a focus trap, Esc to close and focus
  // restoration for free.
  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) {
      el.showModal();
      // showModal() puts focus on the first button, which then shows a focus
      // ring on a phone. Keep focus on the card itself instead; Tab still
      // moves on to the buttons.
      el.focus({ preventScroll: true });
    }
  }, []);

  // A different project: back to the top and the first photo.
  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
    dialog.current?.scrollTo({ top: 0 });
    update();
  }, [project.id, update]);

  // Arrival, in the manner of the home page: the title slides in from the
  // left, the rest rises one after another, the photos follow.
  useGSAP(
    () => {
      const el = dialog.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(el);
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            q('[data-in="title"]'),
            { xPercent: -22, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1.4 },
            0,
          )
          .fromTo(
            q('[data-in="fade"]'),
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.12 },
            0.25,
          )
          .fromTo(
            q('[data-in="slide"]'),
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.14 },
            0.5,
          );
      });
      return () => mm.revert();
    },
    { scope: dialog, dependencies: [project.id] },
  );

  const shift = (direction: 1 | -1) =>
    setZoom((current) => (current === null ? null : (current + direction + total) % total));

  const onKeyDown = (event: React.KeyboardEvent) => {
    const arrow = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!arrow) return;
    if (zoom !== null) shift(arrow);
    else step(arrow);
  };

  // Esc closes the full-size photo first, and only then the project.
  const onCancel = (event: React.SyntheticEvent) => {
    if (zoom !== null) {
      event.preventDefault();
      setZoom(null);
    }
  };

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="project-title"
      tabIndex={-1}
      onClose={onClose}
      onCancel={onCancel}
      onKeyDown={onKeyDown}
    >
      <div className={`tiny ${styles.top}`}>
        <button type="button" onClick={close}>
          ← {t("back")}
        </button>
        <button type="button" onClick={close}>
          {t("close")} ×
        </button>
      </div>

      <div className={styles.head}>
        <div>
          <h2 id="project-title" className={styles.title} data-in="title">
            {title}
          </h2>
          <p className={`tiny ${styles.kind}`} data-in="fade">
            {tp(`items.${project.id}.kind`)}
          </p>
        </div>
        <p className={styles.description} data-in="fade">
          {tp(`items.${project.id}.description`)}
        </p>
      </div>

      <ul ref={track} className={styles.track} {...rowProps} tabIndex={0}>
        {project.images.map((image, i) => (
          <li
            key={image.src}
            className={styles.slide}
            data-in="slide"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            <button
              type="button"
              className={styles.photo}
              onClick={() => setZoom(i)}
              aria-label={`${t("enlarge")}: ${title}, ${t("counter", { current: i + 1, total })}`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes={slideSizes(image, i === 0)}
                quality={90}
                className={styles.image}
                priority={i === 0}
                onLoad={loaded}
              />
            </button>
          </li>
        ))}

        <li className={`${styles.slide} ${styles.nextSlide}`} data-in="slide">
          <button type="button" className={styles.nextCard} onClick={onNext}>
            <Image
              src={next.images[0].src}
              alt=""
              fill
              sizes={nextSizes(next.images[0])}
              quality={85}
              className={styles.nextImage}
              onLoad={loaded}
            />
            <span className={`tiny ${styles.nextLabel}`}>{t("nextProject")} →</span>
            <span className={styles.nextTitle}>{tp(`items.${next.id}.title`)}</span>
          </button>
        </li>
      </ul>

      <div className={styles.controls} data-in="fade">
        <div className={styles.line} {...lineProps} aria-hidden="true">
          <span
            className={styles.thumb}
            style={{
              width: `${bar.size * 100}%`,
              marginLeft: `${bar.offset * 100}%`,
            }}
          />
        </div>
        <div className={styles.arrows}>
          <button type="button" onClick={() => step(-1)} aria-label={t("previous")}>
            ←
          </button>
          <button type="button" onClick={() => step(1)} aria-label={t("next")}>
            →
          </button>
        </div>
      </div>

      {zoom !== null ? (
        <div
          className={styles.viewer}
          role="group"
          aria-label={t("counter", { current: zoom + 1, total })}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) shift(dx < 0 ? 1 : -1);
          }}
        >
          <div className={`tiny ${styles.viewerBar}`}>
            <span aria-live="polite">
              {zoom + 1} / {total}
            </span>
            <button type="button" onClick={() => setZoom(null)}>
              {t("close")} ×
            </button>
          </div>

          <div className={styles.viewerImage}>
            <Image
              key={zoom}
              src={project.images[zoom].src}
              alt={`${title}, ${t("counter", { current: zoom + 1, total })}`}
              fill
              sizes={viewerSizes(project.images[zoom])}
              quality={90}
              className={styles.viewerPhoto}
              priority
            />
          </div>

          {total > 1 ? (
            <div className={styles.viewerArrows}>
              <button type="button" onClick={() => shift(-1)} aria-label={t("previous")}>
                ←
              </button>
              <button type="button" onClick={() => shift(1)} aria-label={t("next")}>
                →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
