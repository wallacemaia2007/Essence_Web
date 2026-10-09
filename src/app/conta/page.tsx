import type { Metadata } from "next";

import { ProtectedArea } from "@/components/auth/ProtectedArea";
import { Container, ThemedSection } from "@/components/common";
import { ContaConteudo } from "@/components/sections/account/ContaConteudo";
import { PageHeader } from "@/components/sections/sobre/PageHeader";

export const metadata: Metadata = {
  title: "Minha conta | Essence",
  description: "Consulte seus dados pessoais e endereços salvos na Essence.",
  robots: { index: false, follow: false },
};

export default function ContaPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Minha conta"
        title="Minha conta"
        description="Seus dados e endereços, organizados em um só lugar."
      />
      <ThemedSection
        aria-label="Dados da conta"
        className="bg-white py-10 text-[#171717] md:py-14"
      >
        <Container className="max-w-5xl">
          <ProtectedArea>
            <ContaConteudo />
          </ProtectedArea>
        </Container>
      </ThemedSection>
    </main>
  );
}
