"use client";

import { useEffect, useState } from "react";

/** Tempo que o header continua à mostra depois de voltar ao topo do hero. */
export const HEADER_TOP_HOLD_MS = 2_000;

type HeaderTopHoldOptions = {
  /** O visitante está no topo de uma página com hero (onde o header recolhe). */
  isAtTop: boolean;
  /** O header estaria visível agora, sem considerar este atraso. */
  isVisible: boolean;
  /** Geometria da página já foi medida (evita agir na carga inicial). */
  hasMeasured: boolean;
  /** Mantém o header visível por um instante na primeira medição no topo. */
  holdOnInitialTop?: boolean;
  delayMs?: number;
};

type Previous = {
  isAtTop: boolean;
  isVisible: boolean;
  hasMeasured: boolean;
};

/**
 * Ao voltar ao topo com o header visível, ele não some na hora: fica à mostra
 * por `delayMs` e só então recolhe. Retorna `true` enquanto esse atraso corre.
 *
 * - Ao abrir a página já no topo, não há atraso (o header nasce recolhido).
 * - Se o visitante sair do topo antes do prazo, o atraso é cancelado.
 */
export function useHeaderTopHold({
  isAtTop,
  isVisible,
  hasMeasured,
  holdOnInitialTop = false,
  delayMs = HEADER_TOP_HOLD_MS,
}: HeaderTopHoldOptions): boolean {
  const [isHolding, setIsHolding] = useState(false);
  const [previous, setPrevious] = useState<Previous>({
    isAtTop,
    isVisible,
    hasMeasured,
  });

  // Ajuste de estado durante a renderização (padrão do React): compara com a
  // renderização anterior para detectar "acabou de chegar ao topo".
  if (
    previous.isAtTop !== isAtTop ||
    previous.isVisible !== isVisible ||
    previous.hasMeasured !== hasMeasured
  ) {
    setPrevious({ isAtTop, isVisible, hasMeasured });

    if (previous.isAtTop !== isAtTop) {
      const isInitialHomeReveal = holdOnInitialTop && !previous.hasMeasured;
      setIsHolding(
        isAtTop &&
          previous.isVisible &&
          (previous.hasMeasured || isInitialHomeReveal),
      );
    }
  }

  useEffect(() => {
    if (!isHolding) return;

    const timeoutId = window.setTimeout(() => setIsHolding(false), delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [isHolding, delayMs]);

  return isHolding && isAtTop;
}
