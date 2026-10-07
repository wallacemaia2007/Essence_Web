import type { Metadata } from "next";

import { PaginaConjuntos } from "@/components/sections/conjuntos/PaginaConjuntos";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Conjuntos selecionados",
  description:
    "Explore os conjuntos selecionados da Essence e encontre combinações para diferentes momentos.",
  alternates: {
    canonical: routes.conjuntos,
  },
  openGraph: {
    title: "Conjuntos selecionados | Essence",
    description:
      "Uma seleção de looks e peças para expressar seu estilo em cada ocasião.",
    url: routes.conjuntos,
    type: "website",
  },
};

export default function ConjuntosPage() {
  return (
    <main className="flex flex-1 flex-col bg-white">
      <PaginaConjuntos />
    </main>
  );
}
