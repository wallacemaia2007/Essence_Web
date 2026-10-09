import type { Metadata } from "next";

import { CheckoutConteudo } from "@/components/sections/checkout/CheckoutConteudo";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Finalizar compra | Essence",
  description:
    "Informe seus dados, escolha como receber e revise seu pedido Essence.",
  alternates: { canonical: routes.checkout },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Finalizar compra"
        title="Finalizar compra"
        description="Revise seus dados e preferências. O pedido é demonstrativo e nenhum pagamento será processado nesta etapa."
      />
      <CheckoutConteudo />
    </main>
  );
}
