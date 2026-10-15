import type { Metadata } from "next";

import { CatalogoProdutos } from "@/components/sections/catalogo/CatalogoProdutos";
import { routes } from "@/constants/routes";

const description =
  "Explore as peças em promoção no Outlet da Essence Passos. Ofertas demonstrativas, sujeitas à confirmação da loja.";

const metadataBase: Metadata = {
  title: "Outlet",
  description,
  alternates: { canonical: routes.outlet },
  openGraph: {
    title: "Outlet | Essence",
    description,
    url: routes.outlet,
    type: "website",
  },
};

type OutletPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function possuiQueryAtiva(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return Object.keys(searchParams).length > 0;
}

export async function generateMetadata({
  searchParams,
}: OutletPageProps): Promise<Metadata> {
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

export default async function OutletPage({ searchParams }: OutletPageProps) {
  // A leitura da API de request torna a rota dinâmica e mantém useSearchParams sincronizado.
  await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      <CatalogoProdutos modo="outlet" />
    </main>
  );
}
