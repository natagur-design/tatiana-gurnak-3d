import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the dev server by the Mac's address.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  images: {
    formats: ["image/webp"],
    // 90 for the large renders and her portrait, 85 for covers, 75 (the
    // default) for the video stills.
    qualities: [75, 85, 90],
    // The sizes between 2048 and 3840 serve large Retina screens.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3000, 3840],
  },
};

export default withNextIntl(nextConfig);
