import type { Metadata } from "next";

import { CarrinhoConteudo } from "@/components/sections/carrinho/CarrinhoConteudo";
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
      <CarrinhoConteudo />
    </main>
  );
}
