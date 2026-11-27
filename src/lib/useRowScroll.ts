import { useCallback, useEffect, useRef, useState } from "react";

// A row that scrolls sideways, shared by the Projects strip and the photos of a
// project card:
//  - the thin line below shows where you are, and can be clicked or dragged;
//  - with a mouse the row itself can be grabbed and pulled (touch screens
//    already scroll it natively);
//  - the arrows move it by one picture.

/** Pointer travel, in px, before a press counts as a drag and not a click. */
const DRAG_START = 6;

export function useRowScroll(trackRef: React.RefObject<HTMLUListElement | null>) {
  // The line's thumb, as fractions of the line.
  const [bar, setBar] = useState({ size: 0.4, offset: 0 });
  const drag = useRef({ id: -1, x: 0, left: 0, moved: false });
  const settle = useRef<number | undefined>(undefined);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const size = Math.min(1, el.clientWidth / el.scrollWidth);
    setBar({ size, offset: max > 0 ? (el.scrollLeft / max) * (1 - size) : 0 });
  }, [trackRef]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(settle.current);
    };
  }, [trackRef, update]);

  const smooth = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  const step = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const width = item ? item.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * width, behavior: smooth() });
  };

  // While something is being dragged the snapping is switched off (see the
  // [data-dragging] rules in the CSS), otherwise the row would jump.
  const hold = () => {
    window.clearTimeout(settle.current);
    trackRef.current?.setAttribute("data-dragging", "true");
  };

  // After a drag: glide to the nearest picture, then switch snapping back on.
  const release = (direction: number) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const origin = el.getBoundingClientRect().left;
    const padding = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const stops = Array.from(el.children, (child) =>
      Math.min(max, child.getBoundingClientRect().left - origin + el.scrollLeft - padding),
    ).concat(max);
    // Prefer the picture ahead in the direction of the pull.
    const ahead = stops.filter((stop) =>
      direction > 0 ? stop >= el.scrollLeft - 1 : direction < 0 ? stop <= el.scrollLeft + 1 : true,
    );
    const target = (ahead.length ? ahead : stops).reduce((best, stop) =>
      Math.abs(stop - el.scrollLeft) < Math.abs(best - el.scrollLeft) ? stop : best,
    );
    el.scrollTo({ left: target, behavior: smooth() });
    settle.current = window.setTimeout(() => el.removeAttribute("data-dragging"), 500);
  };

  const finishRowDrag = (event: React.PointerEvent) => {
    const state = drag.current;
    if (state.id !== event.pointerId) return;
    state.id = -1;
    if (state.moved) release(Math.sign(state.x - event.clientX));
  };

  const rowProps = {
    onScroll: update,
    onPointerDown: (event: React.PointerEvent<HTMLUListElement>) => {
      const el = event.currentTarget;
      drag.current.moved = false;
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return;
      drag.current = { id: event.pointerId, x: event.clientX, left: el.scrollLeft, moved: false };
    },
    onPointerMove: (event: React.PointerEvent<HTMLUListElement>) => {
      const state = drag.current;
      if (state.id !== event.pointerId) return;
      // The button was let go outside the row before the drag began.
      if (event.buttons === 0) return finishRowDrag(event);
      const distance = event.clientX - state.x;
      if (!state.moved) {
        if (Math.abs(distance) < DRAG_START) return;
        state.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        hold();
      }
      event.currentTarget.scrollTo({ left: state.left - distance, behavior: "instant" });
    },
    onPointerUp: finishRowDrag,
    onPointerCancel: finishRowDrag,
    // A drag must not also open the card or the photo under the pointer.
    onClickCapture: (event: React.MouseEvent) => {
      if (!drag.current.moved) return;
      drag.current.moved = false;
      event.preventDefault();
      event.stopPropagation();
    },
    // Stops the browser from dragging a "ghost" copy of a picture.
    onDragStart: (event: React.DragEvent) => event.preventDefault(),
  };

  const seek = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const thumb = rect.width * bar.size;
    if (rect.width <= thumb) return;
    const at = (event.clientX - rect.left - thumb / 2) / (rect.width - thumb);
    el.scrollTo({
      left: Math.max(0, Math.min(1, at)) * (el.scrollWidth - el.clientWidth),
      behavior: "instant",
    });
  };

  const finishSeek = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    release(0);
  };

  const lineProps = {
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      hold();
      seek(event);
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event);
    },
    onPointerUp: finishSeek,
    onPointerCancel: finishSeek,
  };

  return { bar, update, step, rowProps, lineProps };
}
