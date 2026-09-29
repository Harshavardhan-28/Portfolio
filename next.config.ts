import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback; cache optimised variants for a year so the
    // free tier's image transformations are paid for once per size.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [420, 640, 828, 1080, 1200, 1600],
    imageSizes: [48, 96, 140, 240, 400, 600],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|pdf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
