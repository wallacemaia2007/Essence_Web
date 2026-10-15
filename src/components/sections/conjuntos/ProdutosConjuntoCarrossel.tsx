"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Carousel } from "@/components/common";
import { ProdutoColecaoCard } from "@/components/sections/colecao/ProdutoColecaoCard";
import { Button } from "@/components/ui/button";
import {
  type ProdutoVitrine,
  VITRINE_INTERVALO_MS,
  VITRINE_PRODUTOS_POR_SLIDE,
} from "@/data/vitrine";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";

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
    definirArrasteAtivo,
  } = useCarouselSlides(
    produtos,
    VITRINE_PRODUTOS_POR_SLIDE,
    VITRINE_INTERVALO_MS,
  );

  return (
    <div
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
        <Carousel
          ariaLabel={`Peças do conjunto ${conjuntoTitulo}`}
          currentIndex={slideAtual}
          onSelect={irParaSlide}
          onDragStateChange={definirArrasteAtivo}
          showIndicators
          indicatorsLabel={`Páginas das peças de ${conjuntoTitulo}`}
          indicatorAriaLabel={(index) =>
            `Ir para o grupo de peças ${index + 1} de ${conjuntoTitulo}`
          }
          slides={slides.map((slide, slideIndex) => (
            <ul
              key={`slide-${slideIndex}`}
              className="grid grid-cols-1 gap-x-5 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3"
            >
              {slide.map((produto, produtoIndex) => (
                <li key={produto.id} className="min-w-0 before:hidden">
                  <ProdutoColecaoCard
                    produto={produto}
                    priority={slideIndex === slideAtual && produtoIndex === 0}
                  />
                </li>
              ))}
            </ul>
          ))}
        />
      ) : null}
    </div>
  );
}
