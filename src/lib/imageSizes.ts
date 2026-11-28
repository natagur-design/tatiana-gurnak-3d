import type { Photo } from "@/data/projects";

// The `sizes` hints for the project photos: how wide a picture is really drawn,
// so that the browser fetches a file that stays sharp (also on Retina screens)
// without being larger than needed. A photo cropped by its frame ("cover") is
// drawn wider than the frame, which the numbers below take into account. Keep
// them in step with Projects.module.css and GalleryDialog.module.css.

const shape = (photo: Photo) => photo.width / photo.height;

/** Height of the photos in a project card on wide screens. */
const SLIDE = "clamp(220px, 46vh, 520px)";

/** A cover in the Projects strip: a 3:4 frame, clamp(190px, 22vw, 320px) wide. */
export function coverSizes(photo: Photo) {
  const crop = Math.max(1, shape(photo) / (3 / 4));
  const drawn = (width: number) => Math.ceil(width * crop);
  return `(min-width: 1455px) ${drawn(320)}px, (min-width: 864px) ${drawn(22)}vw, ${drawn(190)}px`;
}

/** A photo in a project card. On phones the small ones are cropped to squares. */
export function slideSizes(photo: Photo, first: boolean) {
  const phone = first ? 92 : Math.ceil(46 * Math.max(1, shape(photo)));
  return `(max-width: 700px) ${phone}vw, calc(${SLIDE} * ${shape(photo).toFixed(3)})`;
}

/** The "next project" card: a 3:2 frame. */
export function nextSizes(photo: Photo) {
  const phone = Math.ceil(92 * Math.max(1, shape(photo) / 1.5));
  const wide = Math.max(1.5, shape(photo)).toFixed(3);
  return `(max-width: 700px) ${phone}vw, calc(${SLIDE} * ${wide})`;
}

/** The full-screen viewer shows the whole photo. */
export function viewerSizes(photo: Photo) {
  return `min(100vw, calc(100vh * ${shape(photo).toFixed(3)}))`;
}
