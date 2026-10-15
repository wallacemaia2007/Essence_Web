import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { CanaisContato } from "@/components/sections/contato/CanaisContato";
import { ContatoForm } from "@/components/sections/contato/ContatoForm";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { pages, siteName } from "@/lib/seo";

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
      siteName,
      type: "website",
      images: [
        {
          url: page.ogImage!,
          width: 1920,
          height: 1280,
          alt: "Interior da loja Essence Passos",
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
  const telefoneWhatsApp = contato.whatsapp.replace(/\D/g, "");
  const mensagemInicial = encodeURIComponent(
    "Olá, vim pelo site da Essence e gostaria de atendimento.",
  );

  return (
    <main className="flex flex-1 flex-col bg-white text-[#111111]">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#080808] pt-28 pb-14 text-white sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
        <Container className="max-w-7xl px-5 sm:px-7 lg:px-10">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.72fr)] lg:gap-16">
            <div className="max-w-3xl">
              <nav
                aria-label="Breadcrumb"
                className="mb-10 flex items-center gap-2 text-xs text-white/60"
              >
                <Link
                  href={routes.home}
                  className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Início
                </Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page" className="text-white">
                  Contato
                </span>
              </nav>

              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.22em] text-white/60 uppercase">
                Essence Passos · Atendimento
              </p>
              <h1 className="font-heading mt-5 mb-0 max-w-3xl text-[clamp(3rem,7vw,6.7rem)] leading-[0.98] tracking-[-0.035em]">
                A gente está aqui para você.
              </h1>
              <p className="mt-6 mb-0 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                Dúvidas sobre produtos, pedidos, entregas ou trocas? Escolha um
                canal e fale com a equipe da Essence Passos.
              </p>
              <a
                href="#canais"
                className="mt-8 inline-flex min-h-12 items-center gap-3 border-b border-white/50 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Encontrar meu canal
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </div>

            <aside className="relative border border-white/20 bg-white p-6 text-[#111111] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="m-0 text-[0.62rem] font-semibold tracking-[0.17em] text-[#666666] uppercase">
                  Atendimento direto
                </p>
              </div>
              <h2 className="font-heading mt-7 mb-0 text-3xl leading-tight sm:text-4xl">
                Comece pelo WhatsApp.
              </h2>
              <p className="mt-4 mb-0 text-sm leading-6 text-[#656565]">
                Para conversar com a equipe sobre produtos, pedidos, trocas ou
                atendimento na loja.
              </p>
              <a
                href={`https://wa.me/${telefoneWhatsApp}?text=${mensagemInicial}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-between gap-3 bg-black px-5 text-xs font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                Conversar no WhatsApp
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </aside>
          </div>
        </Container>
      </section>

      <section
        id="canais"
        aria-labelledby="canais-title"
        className="bg-white py-16 sm:py-20 lg:py-24"
      >
        <Container className="max-w-7xl px-5 sm:px-7 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(14rem,0.55fr)_minmax(0,1.45fr)] lg:gap-14">
            <div className="max-w-sm">
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase">
                Canais da loja
              </p>
              <h2
                id="canais-title"
                className="font-heading mt-4 mb-0 text-4xl leading-tight sm:text-5xl"
              >
                Fale do seu jeito.
              </h2>
              <p className="mt-4 mb-0 text-sm leading-7 text-[#656565]">
                Atendimento digital ou presencial, sempre com as informações
                oficiais da Essence Passos.
              </p>
            </div>
            <CanaisContato />
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="mensagem-title"
        className="bg-[#f5f5f5] py-16 sm:py-20 lg:py-24"
      >
        <Container className="max-w-7xl px-5 sm:px-7 lg:px-10">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
            <div className="max-w-md lg:sticky lg:top-28">
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.2em] text-[#777777] uppercase">
                Prefere escrever?
              </p>
              <h2
                id="mensagem-title"
                className="font-heading mt-4 mb-0 text-4xl leading-tight sm:text-5xl"
              >
                Conte para a gente.
              </h2>
              <p className="mt-4 mb-0 text-sm leading-7 text-[#656565]">
                Preencha o formulário. O texto será preparado no WhatsApp para
                você revisar e confirmar antes do envio.
              </p>
              <a
                href={`https://wa.me/${telefoneWhatsApp}?text=${mensagemInicial}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[0.12em] text-[#111111] uppercase underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                Ou abra uma conversa direta
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <ContatoForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
