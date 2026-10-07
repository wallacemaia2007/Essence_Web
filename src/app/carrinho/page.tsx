import type { Metadata } from "next";

import { CarrinhoContagem } from "@/components/sections/carrinho/CarrinhoContagem";
import { CarrinhoConteudo } from "@/components/sections/carrinho/CarrinhoConteudo";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Minha sacola",
  description: "Revise as peças selecionadas na sua sacola Essence.",
  alternates: { canonical: routes.carrinho },
  robots: { index: false, follow: true },
};

export default function CarrinhoPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Minha sacola"
        title="Minha sacola"
        description="Revise suas peças, confira os tamanhos e quantidades e consulte a entrega pelo seu CEP."
      >
      </PageHeader>
      <CarrinhoConteudo />
    </main>
  );
}
