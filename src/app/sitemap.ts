import type { MetadataRoute } from "next";

import { routes } from "@/constants/routes";
import { conjuntosData } from "@/data/conjuntos";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl(routes.conjuntos),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl(routes.colecao),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(routes.outlet),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    ...conjuntosData.itens.map((conjunto) => ({
      url: absoluteUrl(`${routes.colecao}/${conjunto.id}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/sobre"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl(routes.clube),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/contato"), changeFrequency: "monthly", priority: 0.6 },
    {
      url: absoluteUrl(routes.guiaTamanhos),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl(routes.trocasDevolucoes),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl(routes.entregaFrete),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl(routes.politicaPrivacidade),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl(routes.politicaCookies),
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
