import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@vendora/ui", "@vendora/db", "@vendora/auth"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;
