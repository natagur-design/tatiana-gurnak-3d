"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { createFramePlayer } from "@/lib/frames";
import styles from "./Banner.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// A second, shorter camera move. Like the first screen it is pinned and driven
// by scroll, but the two lines of the sentence do the opposite of the hero
// words: they come in from the edges and meet in place.
const FRAME_COUNT = 190;
const frameSrc = (i: number) => `/banner/f${String(i + 1).padStart(3, "0")}.webp`;

export default function Banner() {
  const t = useTranslations("banner");
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const cv = canvas.current;
      if (!el || !cv) return;
      const q = gsap.utils.selector(el);

      const player = createFramePlayer(cv, FRAME_COUNT, frameSrc);

      // Start fetching the pictures a little before the section is reached.
      const watcher = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            player.load();
            watcher.disconnect();
          }
        },
        { rootMargin: "150% 0px" },
      );
      watcher.observe(el);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { frame: 0 };
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=150%",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          })
          .to(
            state,
            {
              frame: FRAME_COUNT - 1,
              ease: "none",
              duration: 1,
              onUpdate: () => player.set(state.frame),
            },
            0,
          )
          .fromTo(
            q('[data-banner="left"]'),
            { xPercent: -45, opacity: 0 },
            { xPercent: 0, opacity: 1, ease: "power2.out", duration: 0.6 },
            0.05,
          )
          .fromTo(
            q('[data-banner="right"]'),
            { xPercent: 45, opacity: 0 },
            { xPercent: 0, opacity: 1, ease: "power2.out", duration: 0.6 },
            0.05,
          );
      });

      // Reduced motion: no pinning, a middle picture stays still.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        player.load();
        player.set(FRAME_COUNT * 0.5);
      });

      return () => {
        watcher.disconnect();
        player.dispose();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.banner} aria-label={`${t("line1")} ${t("line2")}`}>
      <div className={styles.media}>
        <Image src={frameSrc(0)} alt="" fill sizes="100vw" className={styles.image} />
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        <div className={styles.veil} aria-hidden="true" />
      </div>

      <p className={styles.line1}>
        <span className={styles.shell} data-banner="left">
          {t("line1")}
        </span>
      </p>
      <p className={styles.line2}>
        <span className={styles.shell} data-banner="right">
          {t("line2")}
        </span>
      </p>
    </section>
  );
}
