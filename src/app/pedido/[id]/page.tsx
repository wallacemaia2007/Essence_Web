import type { Metadata } from "next";

import { PedidoConfirmacao } from "@/components/sections/checkout/PedidoConfirmacao";

export const metadata: Metadata = {
  title: "Pedido criado",
  description:
    "Confirme os dados do pedido demonstrativo e continue o atendimento da Essence pelo WhatsApp.",
  robots: { index: false, follow: false },
};

type PedidoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PedidoPage({ params }: PedidoPageProps) {
  const { id } = await params;

  return (
    <main className="flex flex-1 flex-col">
      <PedidoConfirmacao orderId={id} />
    </main>
  );
}
