import type { Metadata } from "next";

import { Container, ThemedSection } from "@/components/common";
import { CanaisContato } from "@/components/sections/contato/CanaisContato";
import { ContatoForm } from "@/components/sections/contato/ContatoForm";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { pages } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = pages.contato;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      type: "website",
      images: [
        {
          url: page.ogImage!,
          width: 1200,
          height: 630,
          alt: "Contato",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [page.ogImage!],
    },
  };
}

export default function ContatoPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Contato"
        title="Contato"
        description="Dúvidas, sugestões, parcerias ou apenas um olá — preencha o formulário ou use um dos canais abaixo."
      />
      <ThemedSection className="py-14 md:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.85fr)] lg:items-start">
            <ContatoForm />
            <CanaisContato />
          </div>
        </Container>
      </ThemedSection>
    </main>
  );
}