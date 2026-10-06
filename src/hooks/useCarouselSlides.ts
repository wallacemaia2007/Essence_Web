"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

function agruparEmSlides<T>(itens: readonly T[], tamanhoSlide: number): T[][] {
  const tamanho = Math.max(1, Math.floor(tamanhoSlide));
  const slides: T[][] = [];

  for (let indice = 0; indice < itens.length; indice += tamanho) {
    slides.push(itens.slice(indice, indice + tamanho));
  }

  return slides;
}

export function useCarouselSlides<T>(
  itens: readonly T[],
  itensPorSlide: number,
  intervaloMs: number,
) {
  const movimentoReduzido = useReducedMotion();
  const slides = useMemo(
    () => agruparEmSlides(itens, itensPorSlide),
    [itens, itensPorSlide],
  );
  const [slideSolicitado, setSlideSolicitado] = useState(0);
  const slideAtual = slides.length > 0 ? slideSolicitado % slides.length : 0;
  const [hoverAtivo, setHoverAtivo] = useState(false);
  const [focoAtivo, setFocoAtivo] = useState(false);
  const pausado = hoverAtivo || focoAtivo;

  useEffect(() => {
    if (slides.length < 2 || movimentoReduzido || pausado) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSlideSolicitado((atual) => (atual + 1) % slides.length);
    }, intervaloMs);

    return () => window.clearInterval(intervalId);
  }, [intervaloMs, movimentoReduzido, pausado, slideAtual, slides.length]);

  const irParaSlide = useCallback(
    (destino: number) => {
      if (slides.length === 0) {
        return;
      }

      setSlideSolicitado(
        ((destino % slides.length) + slides.length) % slides.length,
      );
    },
    [slides.length],
  );
  const pausarPorHover = useCallback(() => setHoverAtivo(true), []);
  const retomarPorHover = useCallback(() => setHoverAtivo(false), []);
  const pausarPorFoco = useCallback(() => setFocoAtivo(true), []);
  const retomarPorFoco = useCallback(() => setFocoAtivo(false), []);

  return {
    slides,
    slideAtual,
    irParaSlide,
    pausarPorHover,
    retomarPorHover,
    pausarPorFoco,
    retomarPorFoco,
  };
}
