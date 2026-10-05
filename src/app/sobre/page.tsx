import type { Metadata } from "next";

import { Container, ThemedSection } from "@/components/common";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { pages } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = pages.sobre;
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
          alt: "Sobre o template",
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

export default function SobrePage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Sobre"
        title="Sobre o Template"
        description="Conheça a arquitetura, decisões técnicas e como personalizar este template para seu projeto."
      />
      <ThemedSection className="py-16 md:py-20">
        <Container>
          <article className="prose prose-brand max-w-none">
            <h2>Arquitetura do Projeto</h2>
            <p>
              Este template segue as melhores práticas do Next.js 15+ com App Router,
              organizado em uma estrutura modular e escalável:
            </p>
            <ul>
              <li><strong>src/app/</strong> — Rotas e páginas (App Router)</li>
              <li><strong>src/components/</strong> — Componentes reutilizáveis organizados por categoria</li>
              <li><strong>src/data/</strong> — Dados tipados e constantes da aplicação</li>
              <li><strong>src/lib/</strong> — Utilitários, configurações e helpers</li>
              <li><strong>src/hooks/</strong> — Custom React hooks</li>
              <li><strong>src/constants/</strong> — Constantes globais (rotas, links externos)</li>
            </ul>

            <h2>Design System</h2>
            <p>
              O template utiliza um design system monocromático (preto e branco) com
              suporte a modo claro/escuro via <code>next-themes</code>. O componente
              <code>ThemedSection</code> é um wrapper simples que aplica o fundo e
              cor de texto atuais.
            </p>

            <h2>Tipografia</h2>
            <p>
              Fontes carregadas via <code>next/font/google</code> para performance otimizada:
            </p>
            <ul>
              <li><strong>Geist</strong> — Sans-serif principal</li>
              <li><strong>Geist Mono</strong> — Monoespaçada para código</li>
              <li><strong>Rye</strong> — Display decorativo</li>
              <li><strong>Fraunces</strong> — Serifada para inscrições</li>
              <li><strong>Kalam</strong> — Manuscrita para labels</li>
            </ul>

            <h2>Personalização</h2>
            <p>Para adaptar ao seu projeto, edite principalmente:</p>
            <ul>
              <li><code>src/lib/seo.ts</code> — Metadados do site, URLs, redes sociais</li>
              <li><code>src/constants/routes.ts</code> — Rotas e navegação</li>
              <li><code>src/data/</code> — Conteúdo das páginas</li>
              <li><code>src/app/globals.css</code> — Cores e variáveis CSS</li>
              <li><code>public/images/</code> — Imagens (logo, favicon, OG image)</li>
            </ul>
          </article>
        </Container>
      </ThemedSection>
      <ThemedSection className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-heading text-3xl tracking-wide uppercase md:text-4xl">
              Dúvidas ou sugestões?
            </h2>
            <p className="text-muted-foreground mt-4 leading-8">
              Entre em contato pela página de Contato ou abra uma issue no repositório.
            </p>
          </div>
        </Container>
      </ThemedSection>
    </main>
  );
}