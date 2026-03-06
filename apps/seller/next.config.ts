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
          hostname: "**.public.blob.vercel-storage.com"
        }
      ]
    }
};

export default nextConfig;
