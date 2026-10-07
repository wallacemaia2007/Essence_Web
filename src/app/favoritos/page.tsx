import type { Metadata } from "next";

import { Container, ThemedSection } from "@/components/common";
import { FavoritosLista } from "@/components/sections/favoritos/FavoritosLista";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "As peças da Essence que você marcou com o coração.",
  alternates: { canonical: routes.favoritos },
  openGraph: {
    title: "Favoritos",
    description: "As peças da Essence que você marcou com o coração.",
  },
  robots: { index: false, follow: true },
};

export default function FavoritosPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Favoritos"
        title="Favoritos"
        description="As peças que você marcou com o coração ficam aqui. Tire o coração e ela sai da lista."
      />
      <ThemedSection
        aria-label="Peças favoritas"
        className="bg-white py-12 text-[#231f1b] md:py-16"
      >
        <Container className="max-w-7xl">
          <FavoritosLista />
        </Container>
      </ThemedSection>
    </main>
  );
}
