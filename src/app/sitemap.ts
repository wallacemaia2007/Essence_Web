import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/sobre"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contato"), changeFrequency: "monthly", priority: 0.6 },
  ];
}
