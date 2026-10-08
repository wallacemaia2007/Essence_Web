import type { Metadata } from "next";

import { AccountAreaPlaceholder } from "@/components/sections/account/AccountAreaPlaceholder";

export const metadata: Metadata = {
  title: "Meus pedidos",
  robots: { index: false, follow: false },
};

export default function MeusPedidosPage() {
  return (
    <AccountAreaPlaceholder
      title="Meus pedidos"
      description="Em breve, você poderá acompanhar o histórico e o status dos seus pedidos nesta área."
    />
  );
}
