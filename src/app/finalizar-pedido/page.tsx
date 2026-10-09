import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description:
    "Revise os itens do pedido antes de continuar o atendimento da Essence pelo WhatsApp.",
  alternates: { canonical: routes.finalizarPedido },
  robots: { index: false, follow: false },
};

export default function FinalizarPedidoPage() {
  redirect(routes.checkout);
}
