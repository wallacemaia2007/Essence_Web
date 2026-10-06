"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container, ThemedSection } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  type ProdutoVitrine,
  VITRINE_INTERVALO_MS,
  VITRINE_PRODUTOS_POR_SLIDE,
} from "@/data/vitrine";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { caminhoDaColecao } from "@/lib/colecao";
import { cn } from "@/lib/utils";

import { ProdutoColecaoCard } from "./ProdutoColecaoCard";

export function OutrosConjuntosCarrossel({
  produtos,
}: {
  produtos: readonly ProdutoVitrine[];
}) {
  const {
    slides,
    slideAtual,
    irParaSlide,
    pausarPorHover,
    retomarPorHover,
    pausarPorFoco,
    retomarPorFoco,
  } = useCarouselSlides(
    produtos,
    VITRINE_PRODUTOS_POR_SLIDE,
    VITRINE_INTERVALO_MS,
  );

  return (
    <ThemedSection
      id="outras-pecas"
      aria-labelledby="outras-pecas-titulo"
      className="border-t border-[#e5e1dd] bg-white py-12 text-[#231f1b] md:py-16"
      onMouseEnter={pausarPorHover}
      onMouseLeave={retomarPorHover}
      onFocusCapture={pausarPorFoco}
      onBlurCapture={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          retomarPorFoco();
        }
      }}
    >
      <Container className="max-w-7xl">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#74685f] uppercase">
              Continue explorando
            </p>
            <h2
              id="outras-pecas-titulo"
              className="font-heading mt-3 text-2xl leading-tight tracking-wide text-[#231f1b] uppercase sm:text-3xl md:text-4xl"
            >
              De outros conjuntos
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#655e57] sm:text-base">
              Descubra outras peças e veja, em cada selo, a coleção a que elas
              pertencem.
            </p>
          </div>

          {slides.length > 1 ? (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => irParaSlide(slideAtual - 1)}
                aria-label="Mostrar os três produtos anteriores"
                className="size-11 rounded-full"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => irParaSlide(slideAtual + 1)}
                aria-label="Mostrar os três próximos produtos"
                className="size-11 rounded-full"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>

        {slides.length > 0 ? (
          <div
            role="region"
            aria-roledescription="carrossel"
            aria-label="Peças dos outros conjuntos"
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transform: `translateX(-${slideAtual * 100}%)` }}
              >
                {slides.map((slide, slideIndex) => (
                  <ul
                    key={`slide-${slideIndex}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${slideIndex + 1} de ${slides.length}`}
                    aria-hidden={slideIndex !== slideAtual}
                    inert={slideIndex !== slideAtual ? true : undefined}
                    className="grid w-full shrink-0 grid-cols-1 gap-x-4 gap-y-8 p-0 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6"
                  >
                    {slide.map((produto, itemIndex) => (
                      <li key={produto.id} className="min-w-0 before:hidden">
                        <ProdutoColecaoCard
                          produto={produto}
                          priority={
                            slideIndex === slideAtual && itemIndex === 0
                          }
                          hrefColecao={caminhoDaColecao(produto.colecao)}
                        />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {slides.length > 1 ? (
              <div
                role="group"
                aria-label="Páginas do carrossel de outros conjuntos"
                className="mt-7 flex items-center justify-center gap-2"
              >
                {slides.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    type="button"
                    onClick={() => irParaSlide(index)}
                    aria-label={`Ir para o grupo de produtos ${index + 1}`}
                    aria-current={slideAtual === index ? "page" : undefined}
                    className={cn(
                      "h-1 transition-[width,background-color] duration-300 motion-reduce:transition-none",
                      slideAtual === index
                        ? "w-8 bg-[#231f1b]"
                        : "w-4 bg-[#cfc6bc] hover:bg-[#8e8175]",
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="border-y border-[#e5e1dd] py-6 text-sm leading-6 text-[#655e57]">
            Outras peças aparecerão aqui quando forem cadastradas.
          </p>
        )}
      </Container>
    </ThemedSection>
  );
}
