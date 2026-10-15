import type { Metadata } from "next";

import { CatalogoProdutos } from "@/components/sections/catalogo/CatalogoProdutos";
import { routes } from "@/constants/routes";

const metadataBase: Metadata = {
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

type ColecaoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function possuiQueryAtiva(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return Object.keys(searchParams).length > 0;
}

export async function generateMetadata({
  searchParams,
}: ColecaoPageProps): Promise<Metadata> {
  const parametros = await searchParams;
  if (!possuiQueryAtiva(parametros)) return metadataBase;

  return {
    ...metadataBase,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ColecaoPage({ searchParams }: ColecaoPageProps) {
  // A leitura da API de request torna a rota dinâmica e mantém useSearchParams sincronizado.
  await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      <CatalogoProdutos />
    </main>
  );
}
