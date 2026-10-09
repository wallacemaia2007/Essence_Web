"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Container, ImageBanner, ThemedSection } from "@/components/common";
import {
  type Novidade,
  NOVIDADES_MAX_ITENS,
  novidadesData,
} from "@/data/novidades";
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
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

function NovidadesCarousel({
  currentIndex,
  mobile = false,
  onNext,
  onPrevious,
  onSelect,
  slides,
}: NovidadesCarouselProps) {
  if (slides.length === 0) {
    return null;
  }

  const slideAtual = currentIndex % slides.length;

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={
        mobile ? "Novidades, um item por slide" : "Novidades, pares de itens"
      }
      className="relative"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${slideAtual * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.map((item) => item.id).join("-")}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}`}
              aria-hidden={index !== slideAtual}
              className="w-full shrink-0"
            >
              <div className={cn("grid gap-0.5", !mobile && "md:grid-cols-2")}>
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
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
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
          <div
            role="group"
            aria-label="Páginas de novidades"
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"
          >
            {slides.map((_, index) => (
              <button
                key={`indicator-${index}`}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none",
                  slideAtual === index
                    ? "bg-white shadow-md"
                    : "bg-white/50 hover:bg-white/75",
                )}
                aria-label={`Ir para o slide ${index + 1}`}
                aria-current={slideAtual === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function HomeNovidades({
  className,
  itens = novidadesData.itens,
}: HomeNovidadesProps) {
  const visiveis = itens.slice(0, NOVIDADES_MAX_ITENS);
  const pares: Novidade[][] = [];

  for (let index = 0; index < visiveis.length; index += 2) {
    pares.push(visiveis.slice(index, index + 2));
  }

  const slidesMobile: NovidadeSlide[] = visiveis.map((item) => [item]);
  const [indiceMobile, setIndiceMobile] = useState(0);
  const [indiceDesktop, setIndiceDesktop] = useState(0);

  useEffect(() => {
    if (slidesMobile.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndiceMobile((index) => (index + 1) % slidesMobile.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slidesMobile.length]);

  useEffect(() => {
    if (pares.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndiceDesktop((index) => (index + 1) % pares.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [pares.length]);

  if (visiveis.length === 0) {
    return null;
  }

  return (
    <ThemedSection
      id="novidades"
      aria-labelledby="novidades-title"
      className={cn("pt-16 md:pt-24", className)}
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
          slides={slidesMobile}
          currentIndex={indiceMobile}
          mobile
          onPrevious={() =>
            setIndiceMobile(
              (index) =>
                (index - 1 + slidesMobile.length) % slidesMobile.length,
            )
          }
          onNext={() =>
            setIndiceMobile((index) => (index + 1) % slidesMobile.length)
          }
          onSelect={setIndiceMobile}
        />
      </div>
      <div className="hidden md:block">
        <NovidadesCarousel
          slides={pares}
          currentIndex={indiceDesktop}
          onPrevious={() =>
            setIndiceDesktop(
              (index) => (index - 1 + pares.length) % pares.length,
            )
          }
          onNext={() => setIndiceDesktop((index) => (index + 1) % pares.length)}
          onSelect={setIndiceDesktop}
        />
      </div>
    </ThemedSection>
  );
}
