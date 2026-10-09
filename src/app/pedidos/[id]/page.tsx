import type { Metadata } from "next";

import { ProtectedArea } from "@/components/auth/ProtectedArea";
import { Container, ThemedSection } from "@/components/common";
import { DetalhePedido } from "@/components/sections/orders/DetalhePedido";
import { PageHeader } from "@/components/sections/sobre/PageHeader";

export const metadata: Metadata = {
  title: "Detalhes do pedido | Essence",
  description: "Acompanhe o status e consulte os detalhes do seu pedido.",
  robots: { index: false, follow: false },
};

type PedidoDetalhePageProps = {
  params: Promise<{ id: string }>;
};

export default async function PedidoDetalhePage({
  params,
}: PedidoDetalhePageProps) {
  const { id } = await params;

  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Detalhes do pedido"
        title="Acompanhe seu pedido"
        description="Consulte os itens, o recebimento e as atualizações do seu pedido."
      />
      <ThemedSection
        aria-label="Detalhes e acompanhamento do pedido"
        className="bg-white py-10 text-[#171717] md:py-14"
      >
        <Container className="max-w-5xl">
          <ProtectedArea>
            <DetalhePedido key={id} orderId={id} />
          </ProtectedArea>
        </Container>
      </ThemedSection>
    </main>
  );
}
