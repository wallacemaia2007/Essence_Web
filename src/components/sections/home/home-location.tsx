import { ArrowUpRight, MapPin } from "lucide-react";

import { Container, ThemedSection } from "@/components/common";
import { ConsentGate } from "@/components/consent/ConsentGate";
import { localizacaoLoja } from "@/data/localizacao";

export function HomeLocation() {
  return (
    <ThemedSection
      id="localizacao"
      aria-labelledby="home-location-title"
      className="bg-white py-16 text-[#231f1b] md:py-24"
    >
      <Container className="max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:gap-12 lg:gap-16">
          <div className="relative aspect-[4/3] min-h-[17rem] overflow-hidden rounded-2xl border border-[#231f1b]/15 bg-[#f5f5f5] shadow-xl md:min-h-[20rem]">
            <ConsentGate
              category="preferences"
              title="Mapa da loja"
              description="O Google Maps só será carregado após você permitir recursos da categoria Preferências."
              className="absolute inset-0"
            >
              <iframe
                src={localizacaoLoja.mapaIncorporadoUrl}
                title="Mapa da loja Essence na Avenida Comendador Francisco Avelino Maia, em Passos, Minas Gerais"
                className="absolute inset-0 size-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </ConsentGate>
          </div>

          <div className="max-w-lg">
            <p className="m-0 text-left text-[0.68rem] font-bold tracking-[0.22em] text-[#756d65] uppercase">
              Nossa loja física
            </p>
            <h2
              id="home-location-title"
              className="font-heading mt-3 mb-0 text-left text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.04] font-medium tracking-[0.015em]"
            >
              Venha nos visitar.
            </h2>
            <p className="mt-4 mb-0 max-w-md text-left text-[0.95rem] leading-[1.75] text-[#655e57]">
              A Essence está em Passos, Minas Gerais. Será um prazer receber
              você em nossa loja.
            </p>

            <address className="mt-6 flex items-start gap-3 text-left text-[0.92rem] leading-[1.7] text-[#39332d] not-italic">
              <MapPin
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-[#8a6746]"
              />
              <span className="grid">
                {localizacaoLoja.endereco.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </address>

            <a
              href={localizacaoLoja.comoChegarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center gap-2 border-b border-[#231f1b]/40 text-left text-xs font-bold tracking-[0.1em] text-[#231f1b] uppercase transition hover:-translate-y-0.5 hover:border-[#8a6746] hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b] motion-reduce:transform-none motion-reduce:transition-none"
              aria-label="Abrir rotas para a loja no Google Maps em uma nova aba"
            >
              Como chegar
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </ThemedSection>
  );
}
