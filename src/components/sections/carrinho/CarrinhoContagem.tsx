"use client";

import { useCarrinho } from "@/hooks/useCarrinho";

export function CarrinhoContagem() {
  const { quantidadeTotal, hidratado } = useCarrinho();

  return (
    <p aria-live="polite" className="text-muted-foreground text-base">
      {hidratado
        ? `${quantidadeTotal} ${quantidadeTotal === 1 ? "peça" : "peças"} na sacola`
        : "Carregando sua sacola…"}
    </p>
  );
}
