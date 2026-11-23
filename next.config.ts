import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the dev server by the Mac's address.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
