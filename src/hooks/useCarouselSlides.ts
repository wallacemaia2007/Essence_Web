"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

function agruparEmSlides<T>(itens: readonly T[], tamanhoSlide: number): T[][] {
  const tamanho = Math.max(1, Math.floor(tamanhoSlide));
  const slides: T[][] = [];

  for (let indice = 0; indice < itens.length; indice += tamanho) {
    slides.push(itens.slice(indice, indice + tamanho));
  }

  return slides;
}

type CarouselOptions = {
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  respectReducedMotion?: boolean;
};

export function useCarouselSlides<T>(
  itens: readonly T[],
  itensPorSlide: number,
  intervaloMs: number,
  options: CarouselOptions = {},
) {
  const {
    pauseOnHover = true,
    pauseOnFocus = true,
    respectReducedMotion = true,
  } = options;
  const movimentoReduzido = useReducedMotion();
  const slides = useMemo(
    () => agruparEmSlides(itens, itensPorSlide),
    [itens, itensPorSlide],
  );
  const [slideSolicitado, setSlideSolicitado] = useState(0);
  const slideAtual = slides.length > 0 ? slideSolicitado % slides.length : 0;
  const [hoverAtivo, setHoverAtivo] = useState(false);
  const [focoAtivo, setFocoAtivo] = useState(false);
  const [arrasteAtivo, setArrasteAtivo] = useState(false);
  const [interacaoManualAtiva, setInteracaoManualAtiva] = useState(false);
  const temporizadorInteracaoRef = useRef<number | null>(null);
  const pausado =
    (pauseOnHover && hoverAtivo) ||
    (pauseOnFocus && focoAtivo) ||
    arrasteAtivo ||
    interacaoManualAtiva;

  useEffect(
    () => () => {
      if (temporizadorInteracaoRef.current !== null) {
        window.clearTimeout(temporizadorInteracaoRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (
      slides.length < 2 ||
      (respectReducedMotion && movimentoReduzido) ||
      pausado
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSlideSolicitado((atual) => (atual + 1) % slides.length);
    }, intervaloMs);

    return () => window.clearInterval(intervalId);
  }, [
    intervaloMs,
    movimentoReduzido,
    pausado,
    respectReducedMotion,
    slideAtual,
    slides.length,
  ]);

  const irParaSlide = useCallback(
    (destino: number) => {
      if (slides.length === 0) {
        return;
      }

      setInteracaoManualAtiva(true);
      if (temporizadorInteracaoRef.current !== null) {
        window.clearTimeout(temporizadorInteracaoRef.current);
      }
      temporizadorInteracaoRef.current = window.setTimeout(
        () => {
          temporizadorInteracaoRef.current = null;
          setInteracaoManualAtiva(false);
        },
        Math.max(1000, intervaloMs),
      );

      setSlideSolicitado(
        ((destino % slides.length) + slides.length) % slides.length,
      );
    },
    [intervaloMs, slides.length],
  );
  const pausarPorHover = useCallback(() => setHoverAtivo(true), []);
  const retomarPorHover = useCallback(() => setHoverAtivo(false), []);
  const pausarPorFoco = useCallback(() => setFocoAtivo(true), []);
  const retomarPorFoco = useCallback(() => setFocoAtivo(false), []);
  const definirArrasteAtivo = useCallback(
    (ativo: boolean) => setArrasteAtivo(ativo),
    [],
  );

  return {
    slides,
    slideAtual,
    irParaSlide,
    pausarPorHover,
    retomarPorHover,
    pausarPorFoco,
    retomarPorFoco,
    definirArrasteAtivo,
  };
}
