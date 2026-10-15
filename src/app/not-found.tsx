import Link from "next/link";

import { Container, ThemedSection } from "@/components/common";
import { SamePageScrollLink } from "@/components/layout/SamePageScrollLink";
import { anchors, routes } from "@/constants/routes";
import { contato } from "@/data/contato";

const whatsappHref = `https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`;

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <ThemedSection className="flex min-h-[68vh] flex-1 items-center bg-white py-20 text-[#231f1b] sm:py-24">
        <Container className="flex w-full max-w-4xl flex-col items-center text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#74685f] uppercase sm:text-sm">
            Essence — página não encontrada
          </p>
          <h1 className="font-heading mt-6 text-6xl leading-none tracking-wide uppercase sm:text-8xl md:text-9xl">
            Erro <span className="text-[#8e8175]">404</span>
          </h1>
          <span aria-hidden="true" className="mt-8 h-px w-16 bg-[#b9aea3]" />
          <p className="mt-7 max-w-xl text-sm leading-7 text-[#655e57] sm:text-base sm:leading-8">
            Não encontramos esta página. O endereço pode ter mudado ou já não
            estar disponível.
          </p>
          <nav
            aria-label="Atalhos para continuar no site"
            className="mt-9 grid w-full gap-3 sm:max-w-2xl sm:grid-cols-2"
          >
            <SamePageScrollLink
              href={routes.colecao}
              className="inline-flex min-h-12 items-center justify-center bg-[#231f1b] px-7 text-xs font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Catálogo
            </SamePageScrollLink>
            <Link
              href={routes.outlet}
              className="inline-flex min-h-12 items-center justify-center border border-[#231f1b] px-7 text-xs font-semibold tracking-[0.16em] text-[#231f1b] uppercase transition-colors hover:bg-[#f1efec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Outlet
            </Link>
            <SamePageScrollLink
              href={anchors.novidades}
              className="inline-flex min-h-12 items-center justify-center border border-[#231f1b] px-7 text-xs font-semibold tracking-[0.16em] text-[#231f1b] uppercase transition-colors hover:bg-[#f1efec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Novidades
            </SamePageScrollLink>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center border border-[#231f1b] px-7 text-xs font-semibold tracking-[0.16em] text-[#231f1b] uppercase transition-colors hover:bg-[#f1efec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              WhatsApp
            </a>
          </nav>
        </Container>
      </ThemedSection>
    </main>
  );
}
