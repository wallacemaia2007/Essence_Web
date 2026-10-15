"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container, ThemedSection } from "@/components/common";
import { Button, buttonVariants } from "@/components/ui/button";
import { externalLinks } from "@/constants/routes";
import { ratingSummary, testimonials } from "@/data/testimonials";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const publishedTestimonials = testimonials.filter((item) => item.published);

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const reduceMotion = useReducedMotion();

  const syncControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    setHasOverflow(maxScroll > 1);
    setCanScrollBack(track.scrollLeft > 1);
    setCanScrollForward(track.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncControls();
    const observer = new ResizeObserver(syncControls);
    observer.observe(track);
    return () => observer.disconnect();
  }, [syncControls]);

  if (publishedTestimonials.length === 0) return null;

  function scrollByCard(direction: -1 | 1) {
    const track = trackRef.current;
    const firstCard = track?.querySelector("li");
    if (!track || !firstCard) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const systemPrefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * (firstCard.getBoundingClientRect().width + gap),
      behavior: reduceMotion || systemPrefersReducedMotion ? "auto" : "smooth",
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLUListElement>) {
    // O toque fica a cargo do scroll nativo; o arraste explícito replica o rato.
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    };
    track.style.scrollSnapType = "none";
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) {
      drag.moved = true;
      setIsDragging(true);
    }
    if (drag.moved) track.scrollLeft = drag.startScrollLeft - distance;
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || drag.pointerId !== event.pointerId) return;

    drag.pointerId = -1;
    setIsDragging(false);
    track.style.scrollSnapType = "";
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    syncControls();
  }

  function handleClickCapture(event: MouseEvent<HTMLUListElement>) {
    const drag = dragRef.current;
    if (!drag.moved || event.detail === 0) return;

    drag.moved = false;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <ThemedSection
      id="depoimentos"
      aria-labelledby="testimonials-title"
      className="py-16 md:py-24"
    >
      <Container className="max-w-7xl">
        <div
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          data-scroll-reveal
        >
          <div className="max-w-2xl">
            {ratingSummary ? (
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
                Atendimento nota{" "}
                {ratingSummary.notaMedia.toLocaleString("pt-BR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{" "}
                · {ratingSummary.quantidade} avaliações
              </p>
            ) : null}
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
              Experiências reais
            </p>
            <h2
              id="testimonials-title"
              className="font-heading mt-3 text-3xl leading-tight tracking-wide uppercase md:text-5xl"
            >
              O que dizem nossas clientes
            </h2>
            <div className="bg-primary mt-3 h-px w-32" />
            <p className="text-muted-foreground mt-4 max-w-xl text-base leading-7">
              Cada experiência ajuda-nos a cuidar ainda melhor de quem escolhe a
              Essence.
            </p>
          </div>

          {hasOverflow ? (
            <div
              className="flex shrink-0 gap-2"
              role="group"
              aria-label="Navegação dos depoimentos"
            >
              <Button
                type="button"
                variant="outline"
                aria-label="Ver depoimento anterior"
                aria-controls="testimonials-track"
                disabled={!canScrollBack}
                onClick={() => scrollByCard(-1)}
                className="focus-visible:ring-ring size-11 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-label="Ver próximo depoimento"
                aria-controls="testimonials-track"
                disabled={!canScrollForward}
                onClick={() => scrollByCard(1)}
                className="focus-visible:ring-ring size-11 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
      </Container>

      <div
        className="mt-9 md:mt-12"
        role="region"
        aria-label="Depoimentos das clientes"
        aria-roledescription="carrossel"
        data-scroll-reveal
      >
        <ul
          id="testimonials-track"
          ref={trackRef}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          onScroll={syncControls}
          onDragStart={(event) => event.preventDefault()}
          className={cn(
            "flex snap-x snap-proximity items-start gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-3 select-none motion-reduce:scroll-auto md:gap-5 md:px-8",
            "focus-visible:outline-ring focus-visible:outline-2 focus-visible:-outline-offset-4",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {publishedTestimonials.map((item, index) => (
            <li
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${publishedTestimonials.length}`}
              className="w-[88%] shrink-0 snap-start pl-0 before:hidden sm:w-[62%] md:w-[46%] xl:w-[31%]"
            >
              <article className="border-border bg-card flex min-h-72 flex-col border p-6 shadow-sm md:min-h-80 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="font-heading text-muted-foreground/50 text-6xl leading-[0.7]"
                    aria-hidden="true"
                  >
                    “
                  </span>
                  <div
                    className="flex items-center gap-1"
                    role="img"
                    aria-label={`Nota ${item.nota} de 5`}
                  >
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={cn(
                          "size-4",
                          starIndex < item.nota
                            ? "text-foreground fill-current"
                            : "text-muted-foreground/40",
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                {item.tipo === "print" ? (
                  <div className="mx-auto my-3 w-full max-w-56 rounded-[2rem] border-[5px] border-neutral-900 bg-neutral-900 p-1 shadow-md">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-[1.55rem] bg-neutral-100">
                      {item.foto ? (
                        <Image
                          src={item.foto}
                          alt={`Captura autorizada do depoimento de ${item.nome}`}
                          fill
                          sizes="224px"
                          unoptimized
                          draggable={false}
                          className="object-cover"
                        />
                      ) : (
                        <p className="text-muted-foreground absolute inset-0 grid place-items-center p-5 text-center text-xs leading-5">
                          Captura autorizada por adicionar
                        </p>
                      )}
                    </div>
                  </div>
                ) : item.foto ? (
                  <div className="bg-muted relative mb-4 size-14 overflow-hidden rounded-full">
                    <Image
                      src={item.foto}
                      alt={`Fotografia de ${item.nome}`}
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <blockquote className="text-foreground mt-3 flex-1 text-sm leading-7 md:text-base">
                  {item.texto}
                </blockquote>
                <footer className="border-border mt-6 border-t pt-4">
                  <p className="text-sm font-semibold tracking-wide">
                    {item.nome}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {item.cidade}
                  </p>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <Container className="mt-7 max-w-7xl">
        <a
          href={externalLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2",
          )}
        >
          Ver mais no Instagram
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </Container>
    </ThemedSection>
  );
}
