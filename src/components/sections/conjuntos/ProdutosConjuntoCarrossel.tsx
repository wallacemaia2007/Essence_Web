"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProdutoColecaoCard } from "@/components/sections/colecao/ProdutoColecaoCard";
import { Button } from "@/components/ui/button";
import {
  type ProdutoVitrine,
  VITRINE_INTERVALO_MS,
  VITRINE_PRODUTOS_POR_SLIDE,
} from "@/data/vitrine";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { cn } from "@/lib/utils";

export function ProdutosConjuntoCarrossel({
  conjuntoTitulo,
  produtos,
}: {
  conjuntoTitulo: string;
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
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={`Peças do conjunto ${conjuntoTitulo}`}
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
      {slides.length > 1 ? (
        <div className="mb-4 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => irParaSlide(slideAtual - 1)}
            aria-label={`Mostrar as três peças anteriores de ${conjuntoTitulo}`}
            className="size-11 rounded-full"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => irParaSlide(slideAtual + 1)}
            aria-label={`Mostrar as três próximas peças de ${conjuntoTitulo}`}
            className="size-11 rounded-full"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {slides.length > 0 ? (
        <>
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
                  className="grid w-full shrink-0 grid-cols-1 gap-x-5 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {slide.map((produto, produtoIndex) => (
                    <li key={produto.id} className="min-w-0 before:hidden">
                      <ProdutoColecaoCard
                        produto={produto}
                        priority={
                          slideIndex === slideAtual && produtoIndex === 0
                        }
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
              aria-label={`Páginas das peças de ${conjuntoTitulo}`}
              className="mt-7 flex items-center justify-center gap-2"
            >
              {slides.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  type="button"
                  onClick={() => irParaSlide(index)}
                  aria-label={`Ir para o grupo de peças ${index + 1} de ${conjuntoTitulo}`}
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
        </>
      ) : null}
    </div>
  );
}
