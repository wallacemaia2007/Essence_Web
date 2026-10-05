"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  MapPinned,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type ProjetoEditorial = {
  id: string;
  nome: string;
  descricao: string;
  periodo?: string;
  imagem: {
    src: string;
    alt: string;
    placeholder?: boolean;
  };
  link?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

const DRAG_THRESHOLD = 54;

type ShowcaseCta = {
  label: string;
  href: string;
  external?: boolean;
};

type LinearProjectShowcaseProps = {
  ariaLabel: string;
  itens: ProjetoEditorial[];
  ctaFinal?: ShowcaseCta;
};

export function LinearProjectShowcase({
  ariaLabel,
  ctaFinal,
  itens,
}: LinearProjectShowcaseProps) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  const currentCardRef = useRef<HTMLElement>(null);
  const dragStartXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const currentItem = itens[indiceAtual];
  const previousItem = indiceAtual > 0 ? itens[indiceAtual - 1] : null;
  const hasPrevious = indiceAtual > 0;
  const hasNext = indiceAtual < itens.length - 1;
  const hasLongTitle = (currentItem?.nome.length ?? 0) > 54;

  const progressLabel = useMemo(
    () => `${indiceAtual + 1} de ${itens.length}`,
    [indiceAtual, itens.length],
  );

  const moveTo = useCallback(
    (nextIndex: number) => {
      const boundedIndex = Math.min(Math.max(nextIndex, 0), itens.length - 1);

      if (boundedIndex === indiceAtual) {
        return;
      }

      setIndiceAtual(boundedIndex);
    },
    [indiceAtual, itens.length],
  );

  const animateCurrentCard = useCallback(() => {
    const card = currentCardRef.current;

    if (!card) {
      return;
    }

    gsap.killTweensOf(card);

    if (reducedMotion) {
      gsap.set(card, { autoAlpha: 1, x: 0 });
      return;
    }

    gsap.fromTo(
      card,
      { autoAlpha: 0, x: 28 },
      { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" },
    );
  }, [reducedMotion]);

  useEffect(() => {
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(motionMedia.matches);

    syncMotionPreference();
    motionMedia.addEventListener("change", syncMotionPreference);

    return () => {
      motionMedia.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    animateCurrentCard();
  }, [animateCurrentCard, indiceAtual]);

  function resetDragPosition() {
    const card = currentCardRef.current;

    if (!card) {
      return;
    }

    gsap.to(card, {
      x: 0,
      duration: reducedMotion ? 0 : 0.24,
      ease: "power2.out",
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const interactiveTarget = (event.target as HTMLElement).closest(
      "a, button",
    );

    if (interactiveTarget || event.button !== 0) {
      return;
    }

    isDraggingRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragOffsetRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    gsap.killTweensOf(currentCardRef.current);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return;
    }

    const card = currentCardRef.current;
    const offset = event.clientX - dragStartXRef.current;
    const resistedOffset = offset < 0 ? offset * 0.28 : offset * 0.1;

    dragOffsetRef.current = offset;
    didDragRef.current = Math.abs(offset) > 8;

    if (!reducedMotion && card) {
      gsap.set(card, { x: resistedOffset });
    }
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return;
    }

    const shouldAdvance = dragOffsetRef.current < -DRAG_THRESHOLD;

    isDraggingRef.current = false;
    dragStartXRef.current = 0;
    dragOffsetRef.current = 0;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetDragPosition();

    if (shouldAdvance && hasNext) {
      moveTo(indiceAtual + 1);
    }
  }

  function handleMediaClick() {
    const link = currentItem.link;

    if (!link || didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    if (link.external) {
      window.open(link.href, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.assign(link.href);
  }

  if (!currentItem) {
    return null;
  }

  return (
    <div
      ref={scope}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      className="mt-10 cursor-grab touch-pan-y outline-none select-none active:cursor-grabbing"
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" && hasNext) {
          event.preventDefault();
          moveTo(indiceAtual + 1);
        }

        if (event.key === "ArrowLeft" && hasPrevious) {
          event.preventDefault();
          moveTo(indiceAtual - 1);
        }
      }}
    >
      <p className="sr-only" aria-live="polite">
        {ariaLabel}: {currentItem.nome}, {progressLabel}
      </p>

      <div className={cn("relative", hasPrevious ? "pl-5 md:pl-10" : "pl-0")}>
        {previousItem ? (
          <button
            type="button"
            onClick={() => moveTo(indiceAtual - 1)}
            className="border-border bg-card/55 focus-visible:ring-ring/50 absolute top-4 bottom-4 left-0 block w-4 overflow-hidden rounded-l-lg border text-left transition hover:w-5 focus-visible:ring-3 focus-visible:outline-none md:top-5 md:bottom-5 md:w-8 md:hover:w-10"
            aria-label={`Voltar para ${previousItem.nome}`}
          >
            <span className="bg-primary/35 absolute inset-y-6 left-1 w-1.5 rounded-full md:left-2 md:w-2" />
            <span className="sr-only">{previousItem.nome}</span>
          </button>
        ) : null}

        <article
          key={currentItem.id}
          ref={currentCardRef}
          className="border-border bg-card/74 text-card-foreground relative overflow-hidden rounded-lg border shadow-[0_24px_62px_color-mix(in_srgb,var(--foreground),transparent_86%)]"
        >
          <div className="grid min-h-[30rem] lg:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)]">
            <button
              type="button"
              onClick={handleMediaClick}
              disabled={!currentItem.link}
              className="group relative min-h-[18rem] overflow-hidden text-left disabled:cursor-grab lg:min-h-full"
              aria-label={
                currentItem.link
                  ? `Abrir ${currentItem.nome}`
                  : `Imagem de ${currentItem.nome}`
              }
            >
              <Image
                src={currentItem.imagem.src}
                alt={currentItem.imagem.alt}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover transition duration-500 group-enabled:group-hover:scale-[1.03]"
                priority={indiceAtual === 0}
                unoptimized={
                  typeof currentItem.imagem.src === "string" &&
                  currentItem.imagem.src.endsWith(".svg")
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-transparent" />
              {currentItem.imagem.placeholder ? (
                <span className="bg-card/90 text-primary border-border absolute top-4 left-4 rounded-md border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase">
                  Imagem em breve
                </span>
              ) : null}
            </button>

            <div className="flex flex-col p-6 md:p-8 lg:p-10">
              <h3
                className={cn(
                  "font-heading text-foreground mt-5 tracking-wide uppercase",
                  hasLongTitle
                    ? "text-2xl leading-[1.08] md:text-[1.7rem] lg:text-[1.9rem]"
                    : "text-3xl leading-tight md:text-4xl",
                )}
              >
                {currentItem.nome}
              </h3>
              <p className="text-muted-foreground mt-5 text-base leading-8">
                {currentItem.descricao}
              </p>

              <div className="text-muted-foreground mt-6 grid gap-2 text-sm">
                {currentItem.periodo ? (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays
                      className="text-primary h-4 w-4"
                      aria-hidden="true"
                    />
                    {currentItem.periodo}
                  </span>
                ) : null}
              </div>

              <div className="mt-auto pt-8">
                {currentItem.link ? (
                  <ShowcaseLink link={currentItem.link} />
                ) : null}
                {ctaFinal ? (
                  <ShowcaseLink link={ctaFinal} className="mt-4" />
                ) : null}
              </div>
            </div>
          </div>

          {hasNext ? (
            <button
              type="button"
              onClick={() => moveTo(indiceAtual + 1)}
              className="bg-primary text-primary-foreground focus-visible:ring-ring/50 absolute right-4 bottom-4 inline-flex h-11 w-11 items-center justify-center rounded-lg shadow-lg transition hover:scale-105 focus-visible:ring-3 focus-visible:outline-none"
              aria-label={`Avançar para ${itens[indiceAtual + 1]?.nome}`}
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </article>
      </div>

      <div className="text-muted-foreground mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2" aria-hidden="true">
          {itens.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-2.5 rounded-full transition-all",
                index === indiceAtual
                  ? "bg-primary w-8"
                  : "bg-foreground/30 w-2.5",
              )}
            />
          ))}
        </div>
        <div className="inline-flex items-center gap-3">
          {hasPrevious ? (
            <button
              type="button"
              onClick={() => moveTo(indiceAtual - 1)}
              className="hover:text-primary focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-md px-2 py-1 transition focus-visible:ring-3 focus-visible:outline-none"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Anterior
            </button>
          ) : null}
          <span>{progressLabel}</span>
          {hasNext ? (
            <button
              type="button"
              onClick={() => moveTo(indiceAtual + 1)}
              className="hover:text-primary focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-md px-2 py-1 transition focus-visible:ring-3 focus-visible:outline-none"
            >
              Próximo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ShowcaseLinkProps = {
  link: ShowcaseCta;
  className?: string;
};

function ShowcaseLink({ className, link }: ShowcaseLinkProps) {
  const classes = cn(
    "text-primary focus-visible:ring-ring/50 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase transition hover:opacity-80 focus-visible:ring-3 focus-visible:outline-none",
    className,
  );
  const icon = link.external ? (
    <ExternalLink className="h-4 w-4" aria-hidden="true" />
  ) : (
    <ArrowRight className="h-4 w-4" aria-hidden="true" />
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {link.label}
        {icon}
      </a>
    );
  }

  return (
    <Link href={link.href} className={classes}>
      {link.label}
      {icon}
    </Link>
  );
}
