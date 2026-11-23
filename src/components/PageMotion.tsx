"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Everything that happens while the page scrolls, outside the two pinned
// screens (Hero, Banner):
//  1. the header turns from white-on-photo to a transparent frosted bar once
//     the first section has been reached;
//  2. blocks arrive when they come into view, and again every time they
//     come back (scrolling up or down). Elements opt in with data-reveal:
//       left | right  heading slides in from the edge
//       side          a vertical label slides in from the left
//       fade          opacity only
//       up | slow     rises into place, one after another (slow = calmer)
export default function PageMotion() {
  useGSAP(() => {
    // ---- Header: runs for everyone, motion preference or not ----
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const projects = document.getElementById("projects");
    if (header && projects) {
      ScrollTrigger.create({
        trigger: projects,
        // As soon as the first section starts rising into view, and it stays
        // frosted from there to the very bottom of the page.
        start: "top bottom",
        onEnter: () => (header.dataset.solid = "true"),
        onLeaveBack: () => (header.dataset.solid = "false"),
      });
    }

    // ---- Reveals ----
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const all = (kind: string) => gsap.utils.toArray<HTMLElement>(`[data-reveal="${kind}"]`);

      // Plays on entering, resets once fully out of view, plays again on return.
      const replay = (el: Element) => ({
        trigger: el,
        start: "top 88%",
        toggleActions: "play reset play reset",
      });

      const from = (kind: string, vars: gsap.TweenVars) =>
        all(kind).forEach((el) => gsap.from(el, { ...vars, scrollTrigger: replay(el) }));

      from("left", { xPercent: -22, opacity: 0, duration: 1.4, ease: "power3.out" });
      from("right", { xPercent: 22, opacity: 0, duration: 1.4, ease: "power3.out" });
      from("side", { x: -80, opacity: 0, duration: 1.4, ease: "power3.out" });
      from("fade", { opacity: 0, duration: 1.2, ease: "power2.out" });

      // Groups that arrive one after another.
      const rising = (kind: string, duration: number, stagger: number) => {
        const items = all(kind);
        if (!items.length) return;
        const hidden = { opacity: 0, y: 18 };
        gsap.set(items, hidden);
        ScrollTrigger.batch(items, {
          start: "top 90%",
          end: "bottom top",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration,
              ease: "power3.out",
              stagger,
              overwrite: true,
            }),
          onEnterBack: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration,
              ease: "power3.out",
              stagger,
              overwrite: true,
            }),
          onLeave: (batch) => gsap.set(batch, hidden),
          onLeaveBack: (batch) => gsap.set(batch, hidden),
        });
      };
      rising("up", 1, 0.12);
      rising("slow", 1.7, 0.22);
    });

    return () => mm.revert();
  });

  return null;
}
