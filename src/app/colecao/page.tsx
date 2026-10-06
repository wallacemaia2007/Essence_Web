import type { Metadata } from "next";

import { CatalogoProdutos } from "@/components/sections/catalogo/CatalogoProdutos";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explore as peças e coleções da Essence. Encontre vestidos, conjuntos e novos looks.",
  alternates: {
    canonical: routes.colecao,
  },
  openGraph: {
    title: "Catálogo | Essence",
    description:
      "Explore as peças e coleções da Essence e encontre seu próximo look.",
    url: routes.colecao,
    type: "website",
  },
};

export default function ColecaoPage() {
  return (
    <main className="flex flex-1 flex-col">
      <CatalogoProdutos />
    </main>
  );
}
