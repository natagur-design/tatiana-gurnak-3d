"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The camera move is stored as a short sequence of pictures (public/hero) and
// the scroll position chooses which one is drawn. To use another clip, export
// new frames with the same names and set FRAME_COUNT.
const FRAME_COUNT = 190;
const frameSrc = (i: number) => `/hero/f${String(i + 1).padStart(3, "0")}.webp`;

export default function Hero() {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const cv = canvas.current;
      const ctx = cv?.getContext("2d");
      if (!el || !cv || !ctx) return;
      const q = gsap.utils.selector(el);

      // ---- Frames: load them all, draw the nearest one that is ready ----
      const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
      let current = 0;
      let disposed = false;

      const pick = (index: number) => {
        let img = frames[index];
        for (let i = index; !img && i >= 0; i--) img = frames[i];
        for (let i = index; !img && i < FRAME_COUNT; i++) img = frames[i];
        return img;
      };

      const paint = (img: HTMLImageElement, alpha: number) => {
        const { width: cw, height: ch } = cv;
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      };

      // `position` is fractional: the frame below is drawn, then the next one
      // is faded over it by the remainder, so slow scrolling glides between
      // pictures instead of jumping from one to the next.
      const draw = (position: number) => {
        const base = Math.min(Math.floor(position), FRAME_COUNT - 1);
        const mix = position - base;
        const a = pick(base);
        if (!a) return;
        paint(a, 1);
        if (mix > 0.01 && base < FRAME_COUNT - 1) {
          const b = frames[base + 1];
          if (b) paint(b, mix);
        }
        ctx.globalAlpha = 1;
      };

      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.round(cv.clientWidth * dpr);
        cv.height = Math.round(cv.clientHeight * dpr);
        draw(current);
      };
      fit();
      const resizeObserver = new ResizeObserver(fit);
      resizeObserver.observe(cv);

      // Every 8th picture first (the page works at once, just coarser), then
      // the rest fill in the gaps while the visitor reads.
      const order: number[] = [];
      for (let i = 0; i < FRAME_COUNT; i += 8) order.push(i);
      for (let i = 0; i < FRAME_COUNT; i++) if (i % 8 !== 0) order.push(i);

      for (const i of order) {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          if (disposed) return;
          frames[i] = img;
          if (Math.abs(i - current) <= 8) draw(current);
        };
        img.src = frameSrc(i);
      }

      const mm = gsap.matchMedia();

      // With reduced motion the first frame simply stays on screen.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Arrival: the room settles in and the text rises.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            q('[data-hero="zoom"]'),
            { scale: 1.05, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.8 },
            0,
          )
          .fromTo(
            q('[data-hero="left"]'),
            { xPercent: -14, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1.4 },
            0.3,
          )
          .fromTo(
            q('[data-hero="right"]'),
            { xPercent: 14, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1.4 },
            0.45,
          )
          .fromTo(
            q('[data-hero="fade"]'),
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.12 },
            1.1,
          );

        // Scroll: the screen is pinned while the camera pushes into the room
        // and the two big words part like curtains. Different elements than
        // the arrival animation use, so the two never fight.
        const state = { frame: 0 };
        const scroll = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        scroll
          .to(
            state,
            {
              frame: FRAME_COUNT - 1,
              ease: "none",
              duration: 1,
              onUpdate: () => {
                current = state.frame;
                draw(current);
              },
            },
            0,
          )
          .to(
            q('[data-scrub="left"]'),
            { xPercent: -60, opacity: 0, ease: "power1.in", duration: 0.5 },
            0.1,
          )
          .to(
            q('[data-scrub="right"]'),
            { xPercent: 60, opacity: 0, ease: "power1.in", duration: 0.5 },
            0.1,
          )
          .to(q('[data-scrub="kicker"]'), { opacity: 0, y: -12, duration: 0.25 }, 0.05)
          .to(q('[data-scrub="foot"]'), { opacity: 0, duration: 0.3 }, 0.05);
      });

      return () => {
        disposed = true;
        resizeObserver.disconnect();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <div className={styles.zoom} data-hero="zoom">
          {/* First frame as a still: it is on screen before any script runs. */}
          <Image
            src={frameSrc(0)}
            alt={t("imageAlt")}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className={styles.poster}
          />
          <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        </div>
        <div className={styles.shade} aria-hidden="true" />
      </div>

      {/* Reads as one sentence: "3D visualization of interiors and exteriors". */}
      <h1 id="hero-title" className={styles.title}>
        <span className={styles.kickerShell} data-scrub="kicker">
          <span className={`tiny ${styles.kicker}`} data-hero="fade">
            {t("kicker")}
          </span>
        </span>
        <span className={styles.words}>
          <span className={styles.shell} data-scrub="left">
            <span className={styles.word} data-hero="left">
              {t("word1")}
            </span>
          </span>
          <span className="sr-only"> {t("and")} </span>
          <span className={`${styles.shell} ${styles.shellRight}`} data-scrub="right">
            <span className={styles.word} data-hero="right">
              {t("word2")}
            </span>
          </span>
        </span>
      </h1>

      <div className={styles.foot} data-scrub="foot">
        <p className={styles.note} data-hero="fade">
          {t("note")}
        </p>
        <a className={`tiny outline ${styles.cta}`} data-hero="fade" href="#contact">
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
