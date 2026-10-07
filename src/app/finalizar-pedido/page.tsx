import type { Metadata } from "next";

import { FinalizarPedidoConteudo } from "@/components/sections/carrinho/FinalizarPedidoConteudo";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description:
    "Revise os itens do pedido antes de continuar o atendimento da Essence pelo WhatsApp.",
  alternates: { canonical: routes.finalizarPedido },
  robots: { index: false, follow: false },
};

export default function FinalizarPedidoPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Finalizar pedido"
        title="Quase lá"
        description="Você será redirecionado para nosso atendimento no WhatsApp para confirmar os detalhes do pedido."
      />
      <FinalizarPedidoConteudo />
    </main>
  );
}
