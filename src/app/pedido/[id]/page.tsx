import type { Metadata } from "next";

import { PedidoConfirmacao } from "@/components/sections/checkout/PedidoConfirmacao";
import { PageHeader } from "@/components/sections/sobre/PageHeader";

export const metadata: Metadata = {
  title: "Confirmação do pedido | Essence",
  description: "Consulte o resumo e os próximos passos do seu pedido Essence.",
  robots: { index: false, follow: false },
};

type PedidoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PedidoPage({ params }: PedidoPageProps) {
  const { id } = await params;

  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Pedido criado"
        title="Pedido criado"
        description="Consulte o resumo demonstrativo e saiba quais são os próximos passos."
      />
      <PedidoConfirmacao orderId={id} />
    </main>
  );
}
