// A camera move stored as a numbered sequence of pictures, drawn on a canvas.
// The position is fractional: the picture below is drawn and the next one is
// faded over it by the remainder, so slow scrolling glides.
// Pictures load every 8th first (works at once, coarser), then fill in.
export function createFramePlayer(
  canvas: HTMLCanvasElement,
  count: number,
  src: (index: number) => string,
) {
  const ctx = canvas.getContext("2d");
  const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);
  let position = 0;
  let disposed = false;
  let started = false;

  const pick = (index: number) => {
    let img = frames[index];
    for (let i = index; !img && i >= 0; i--) img = frames[i];
    for (let i = index; !img && i < count; i++) img = frames[i];
    return img;
  };

  const paint = (img: HTMLImageElement, alpha: number) => {
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  const draw = () => {
    const base = Math.min(Math.floor(position), count - 1);
    const mix = position - base;
    const a = pick(base);
    if (!a || !ctx) return;
    paint(a, 1);
    if (mix > 0.01 && base < count - 1) {
      const b = frames[base + 1];
      if (b) paint(b, mix);
    }
    ctx.globalAlpha = 1;
  };

  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    draw();
  };
  fit();
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(canvas);

  const load = () => {
    if (started) return;
    started = true;
    const order: number[] = [];
    for (let i = 0; i < count; i += 8) order.push(i);
    for (let i = 0; i < count; i++) if (i % 8 !== 0) order.push(i);
    for (const i of order) {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        frames[i] = img;
        if (Math.abs(i - position) <= 8) draw();
      };
      img.src = src(i);
    }
  };

  return {
    load,
    set(next: number) {
      position = next;
      draw();
    },
    dispose() {
      disposed = true;
      resizeObserver.disconnect();
    },
  };
}
