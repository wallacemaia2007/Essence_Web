import { ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container, ThemedSection } from "@/components/common";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { absoluteUrl, pages } from "@/lib/seo";

const page = pages.clube;
const whatsappHref = `https://wa.me/${contato.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Olá! Gostaria de saber mais sobre o Clube da Essence.",
)}`;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: absoluteUrl(page.path) },
  openGraph: {
    title: `${page.title} | Essence`,
    description: page.description,
    url: absoluteUrl(page.path),
    type: "website",
    images: [{ url: page.ogImage ?? "/images/about/about-essence.webp" }],
  },
};

export default function ClubePage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Clube da Essence"
        title="Clube da Essence"
        description="Um espaço para reunir as informações oficiais do Clube da Essence."
      />

      <ThemedSection className="bg-white py-14 text-[#171717] sm:py-16 md:py-20">
        <Container className="max-w-7xl">
          <section className="mx-auto max-w-3xl border border-black/10 bg-[#faf9f7] p-6 sm:p-9">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#75695e] uppercase">
              Essence · Passos
            </p>
            <h2 className="font-heading mt-3 text-2xl tracking-wide uppercase sm:text-3xl">
              Informações do Clube
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#595959] sm:text-base">
              As informações sobre o Clube da Essence serão divulgadas pelos
              canais oficiais da loja. Para tirar dúvidas, fale diretamente com
              a equipe Essence.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#171717] px-6 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                Falar com a equipe
              </a>
              <Link
                href={routes.colecao}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#171717] px-6 text-xs font-semibold tracking-[0.14em] text-[#171717] uppercase transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                Explorar o catálogo
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </section>
        </Container>
      </ThemedSection>
    </main>
  );
}
