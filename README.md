# Tatiana Gurnak, 3D visualization of interiors and exteriors

Portfolio website for Tatiana Gurnak, a 3D visualizer of interiors and exteriors.
A single scrolling page: scroll-driven hero and banner video, a portfolio of projects
with galleries, services, about, and contacts. It is static: no backend, no database,
no forms, no analytics, no cookies.

## Stack

- [Next.js](https://nextjs.org) (App Router) and TypeScript
- CSS Modules, CSS variables, Grid and Flexbox
- [next-intl](https://next-intl.dev) for texts and localized URLs (English for now)
- [GSAP](https://gsap.com) with ScrollTrigger for the scroll animations
- `next/image` and `next/font` for images and fonts

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000/en>.

| Script                 | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run dev`          | development server                |
| `npm run build`        | production build                  |
| `npm run start`        | serve the production build        |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | TypeScript check                  |
| `npm run format`       | format everything with Prettier   |
| `npm run format:check` | check formatting without changing |

## Project structure

```
messages/en.json          all texts (translations live here, one file per language)
public/images/            portfolio photos, named <project>-<number>.jpg
public/hero/, banner/     frame sequences for the two scroll-driven videos
src/app/[locale]/         the page, the privacy policy page, layout and metadata
src/components/           Header, Hero, Projects, Banner, Services, About, Footer, ...
src/config/contacts.ts    contact links (WhatsApp, Instagram, Telegram, email) and site URL
src/data/projects.ts      the list of projects and their photos
src/i18n/                 routing and request configuration for next-intl
src/lib/frames.ts         plays a frame sequence on a canvas, driven by scroll
```

## Editing the content

- **Contacts:** edit `src/config/contacts.ts`. A link left empty is hidden on the site
  (the email icon is the exception: it stays on show without a link until an address is set).
- **Add a project:** put photos in `public/images/` (the first one is the cover), add an entry to
  `src/data/projects.ts`, and add its title, kind and description to `messages/en.json` under
  `projects.items.<id>`.
- **Texts:** everything visible is in `messages/en.json`.

## Environment

`NEXT_PUBLIC_SITE_URL` is the public address of the site, for example
`https://example.com`. It is used for canonical links, `hreflang`, Open Graph, `sitemap.xml`
and `robots.txt`. Set it in the hosting settings before the production build. Without it the
links point to `http://localhost:3000`. There are no secrets in this project.

## Deployment

The project builds with `npm run build` and runs on any host that supports Next.js
(Vercel or Netlify, for example). Set `NEXT_PUBLIC_SITE_URL` there.

## Frame sequences

The hero and the "Show the space" banner are played from numbered WebP frames
(`public/hero`, `public/banner`) drawn on a canvas as you scroll. To use another clip, export
new frames with the same naming (`f001.webp`, `f002.webp`, ...) and set the frame count in
`src/components/Hero.tsx` or `src/components/Banner.tsx`.
