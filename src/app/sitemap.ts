import type { MetadataRoute } from "next";

import { routes } from "@/constants/routes";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl(routes.colecao),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: absoluteUrl("/sobre"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contato"), changeFrequency: "monthly", priority: 0.6 },
    {
      url: absoluteUrl(routes.politicaPrivacidade),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl(routes.termosUso),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
