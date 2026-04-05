import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@vendora/ui", "@vendora/auth", "@vendora/db"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      }
    ],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [480, 640, 750, 828, 1200, 1920, 2048, 3840],
    formats: ["image/avif", "image/webp"]
  },
  cacheComponents: true
};

export default nextConfig;
