// Public contact details. An empty Telegram is hidden on the site.
export const contacts = {
  whatsapp: "https://wa.me/message/A2WTBO4V7YGKP1",
  instagram: "https://www.instagram.com/tatiana_3dvisual/",
  telegram: "https://t.me/tatianagurnak",
  email: "tatiana.gurnak@gmail.com",
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
