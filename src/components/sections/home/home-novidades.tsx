"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FocusEventHandler } from "react";

import {
  Carousel,
  Container,
  ImageBanner,
  ThemedSection,
} from "@/components/common";
import {
  type Novidade,
  NOVIDADES_MAX_ITENS,
  novidadesData,
} from "@/data/novidades";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { cn } from "@/lib/utils";

type HomeNovidadesProps = {
  className?: string;
  /** Novidades da seção. Troque pela API mantendo o tipo `Novidade`. */
  itens?: readonly Novidade[];
};

type NovidadeSlide = readonly Novidade[];

type NovidadesCarouselProps = {
  slides: readonly NovidadeSlide[];
  currentIndex: number;
  mobile?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocusCapture: () => void;
  onBlurCapture: FocusEventHandler<HTMLDivElement>;
  onDragStateChange: (isDragging: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

function NovidadesCarousel({
  currentIndex,
  mobile = false,
  onBlurCapture,
  onDragStateChange,
  onFocusCapture,
  onMouseEnter,
  onMouseLeave,
  onNext,
  onPrevious,
  onSelect,
  slides,
}: NovidadesCarouselProps) {
  return (
    <Carousel
      ariaLabel={
        mobile ? "Novidades, um item por slide" : "Novidades, pares de itens"
      }
      className="relative"
      currentIndex={currentIndex}
      onSelect={onSelect}
      onDragStateChange={onDragStateChange}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      showIndicators
      indicatorsLabel="Páginas de novidades"
      indicatorAriaLabel={(index) => `Ir para o slide ${index + 1}`}
      indicatorVariant="dot"
      indicatorContainerClassName="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"
      indicatorClassName="h-2 w-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      activeIndicatorClassName="bg-white shadow-md"
      inactiveIndicatorClassName="bg-white/50 hover:bg-white/75"
      trackClassName="transition-transform duration-700 ease-in-out motion-reduce:transition-none"
      controlsOverlay={
        slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-6"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6"
              aria-label="Próximo slide"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null
      }
      slides={slides.map((slide) => (
        <div
          key={slide.map((item) => item.id).join("-")}
          className={cn("grid w-full gap-0.5", !mobile && "md:grid-cols-2")}
        >
          {slide.map((item) => (
            <div key={item.id} className="w-full">
              <ImageBanner
                imageSrc={item.image}
                imageAlt={item.alt}
                buttonLabel={item.buttonLabel ?? "Comprar"}
                buttonAriaLabel={`Comprar ${item.nome}`}
                href={item.href}
                external={item.href.startsWith("http")}
                buttonVariant="light"
                buttonPosition="bottom"
                buttonClassName="translate-y-[-1.5rem] md:translate-y-[-2rem]"
                objectPosition={item.objectPosition}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="min-h-[30rem] md:min-h-[min(48rem,88svh)]"
              />
            </div>
          ))}
        </div>
      ))}
    />
  );
}

export function HomeNovidades({
  className,
  itens = novidadesData.itens,
}: HomeNovidadesProps) {
  const visiveis = itens.slice(0, NOVIDADES_MAX_ITENS);
  const carouselMobile = useCarouselSlides(visiveis, 1, 5000);
  const carouselDesktop = useCarouselSlides(visiveis, 2, 5000);

  if (visiveis.length === 0) {
    return null;
  }

  return (
    <ThemedSection
      id="novidades"
      aria-labelledby="novidades-title"
      className={cn("pt-8 md:pt-12", className)}
    >
      <Container className="max-w-7xl">
        <div className="pb-8 md:pb-12">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
            {novidadesData.eyebrow}
          </p>
          <h2
            id="novidades-title"
            className="font-heading mt-3 text-3xl leading-tight tracking-wide uppercase md:text-5xl"
          >
            {novidadesData.titulo}
          </h2>
        </div>
      </Container>

      <div className="md:hidden">
        <NovidadesCarousel
          slides={carouselMobile.slides}
          currentIndex={carouselMobile.slideAtual}
          mobile
          onMouseEnter={carouselMobile.pausarPorHover}
          onMouseLeave={carouselMobile.retomarPorHover}
          onFocusCapture={carouselMobile.pausarPorFoco}
          onBlurCapture={(event) => {
            if (
              !(event.relatedTarget instanceof Node) ||
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              carouselMobile.retomarPorFoco();
            }
          }}
          onDragStateChange={carouselMobile.definirArrasteAtivo}
          onPrevious={() =>
            carouselMobile.irParaSlide(carouselMobile.slideAtual - 1)
          }
          onNext={() =>
            carouselMobile.irParaSlide(carouselMobile.slideAtual + 1)
          }
          onSelect={carouselMobile.irParaSlide}
        />
      </div>
      <div className="hidden md:block">
        <NovidadesCarousel
          slides={carouselDesktop.slides}
          currentIndex={carouselDesktop.slideAtual}
          onMouseEnter={carouselDesktop.pausarPorHover}
          onMouseLeave={carouselDesktop.retomarPorHover}
          onFocusCapture={carouselDesktop.pausarPorFoco}
          onBlurCapture={(event) => {
            if (
              !(event.relatedTarget instanceof Node) ||
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              carouselDesktop.retomarPorFoco();
            }
          }}
          onDragStateChange={carouselDesktop.definirArrasteAtivo}
          onPrevious={() =>
            carouselDesktop.irParaSlide(carouselDesktop.slideAtual - 1)
          }
          onNext={() =>
            carouselDesktop.irParaSlide(carouselDesktop.slideAtual + 1)
          }
          onSelect={carouselDesktop.irParaSlide}
        />
      </div>
    </ThemedSection>
  );
}
