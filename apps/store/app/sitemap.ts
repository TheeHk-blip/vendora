import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL as string;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      priority: 0.9
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: new Date(),
      priority: 0.9
    },
  ]
}