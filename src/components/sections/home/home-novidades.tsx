"use client";

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

export function HomeNovidades({
  className,
  itens = novidadesData.itens,
}: HomeNovidadesProps) {
  const visiveis = itens.slice(0, NOVIDADES_MAX_ITENS);

  const [currentIndex, setCurrentIndex] = useState(0);

  const pares: Novidade[][] = [];
  for (let i = 0; i < visiveis.length; i += 2) {
    pares.push(visiveis.slice(i, i + 2));
  }

  useEffect(() => {
    if (pares.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pares.length);
    }, 5000);

    return () => clearInterval(interval);
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

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {pares.map((par, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="grid gap-0.5 md:grid-cols-2">
                  {par.map((item) => (
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

        {pares.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + pares.length) % pares.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50 md:left-6"
              aria-label="Slide anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % pares.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50 md:right-6"
              aria-label="Próximo slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {pares.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    currentIndex === index
                      ? "bg-white shadow-md"
                      : "bg-white/40 hover:bg-white/60",
                  )}
                  aria-label={`Ir para o slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ThemedSection>
  );
}