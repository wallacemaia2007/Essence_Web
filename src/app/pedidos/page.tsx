import type { Metadata } from "next";

import { ProtectedArea } from "@/components/auth/ProtectedArea";
import { Container, ThemedSection } from "@/components/common";
import { PedidosLista } from "@/components/sections/orders/PedidosLista";
import { PageHeader } from "@/components/sections/sobre/PageHeader";

export const metadata: Metadata = {
  title: "Meus pedidos | Essence",
  description: "Consulte e acompanhe seus pedidos da Essence.",
  robots: { index: false, follow: false },
};

export default function PedidosPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Meus pedidos"
        title="Meus pedidos"
        description="Acompanhe o andamento de cada compra e consulte seus detalhes."
      />
      <ThemedSection
        aria-label="Lista de pedidos"
        className="bg-white py-10 text-[#171717] md:py-14"
      >
        <Container className="max-w-5xl">
          <ProtectedArea>
            <PedidosLista />
          </ProtectedArea>
        </Container>
      </ThemedSection>
    </main>
  );
}
