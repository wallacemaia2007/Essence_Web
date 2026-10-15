import type { Metadata } from "next";

import { CarrinhoConteudo } from "@/components/sections/carrinho/CarrinhoConteudo";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Minha sacola",
  description: "Revise as peças selecionadas na sua sacola Essence.",
  alternates: { canonical: routes.carrinho },
  robots: { index: false, follow: true },
};

type CarrinhoPageProps = {
  searchParams: Promise<{ aviso?: string | string[] }>;
};

export default async function CarrinhoPage({
  searchParams,
}: CarrinhoPageProps) {
  const params = await searchParams;
  const showCheckoutEmptyNotice = params.aviso === "checkout-vazio";

  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        compactBottom
        currentPage="Minha sacola"
        title="Minha sacola"
        description="Revise suas peças, confira os tamanhos e quantidades e consulte a entrega pelo seu CEP."
      />
      <CarrinhoConteudo showCheckoutEmptyNotice={showCheckoutEmptyNotice} />
    </main>
  );
}
