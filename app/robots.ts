import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://upright-cultivate.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api", "/supply/checkout"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}