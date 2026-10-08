import type { Metadata } from "next";

import { AccountAreaPlaceholder } from "@/components/sections/account/AccountAreaPlaceholder";

export const metadata: Metadata = {
  title: "Meu perfil",
  robots: { index: false, follow: false },
};

export default function PerfilPage() {
  return (
    <AccountAreaPlaceholder
      title="Meu perfil"
      description="Em breve, você poderá consultar e atualizar os dados da sua conta Essence por aqui."
    />
  );
}
