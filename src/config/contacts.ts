// Public contact details. Anything left empty is hidden on the site.
// TODO: add Telegram and email once they are confirmed.
export const contacts = {
  whatsapp: "https://wa.me/message/A2WTBO4V7YGKP1",
  instagram: "https://www.instagram.com/tatiana_3dvisual/",
  telegram: "",
  email: "",
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
