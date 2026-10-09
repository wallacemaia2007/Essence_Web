import type { ProdutoVitrine } from "@/data/vitrine";

type PrecoPromocional = Pick<ProdutoVitrine, "preco" | "precoOriginal">;

/** Percentual inteiro arredondado; retorna zero para valores inválidos ou sem desconto. */
export function percentualDesconto(
  precoOriginal: number,
  preco: number,
): number {
  if (
    !Number.isFinite(precoOriginal) ||
    !Number.isFinite(preco) ||
    precoOriginal <= 0 ||
    preco < 0 ||
    precoOriginal <= preco
  ) {
    return 0;
  }

  return Math.round(((precoOriginal - preco) / precoOriginal) * 100);
}

/** Uma promoção exige os dois preços e preço original estritamente maior. */
export function emPromocao(produto: PrecoPromocional): boolean {
  return (
    typeof produto.precoOriginal === "number" &&
    typeof produto.preco === "number" &&
    Number.isFinite(produto.precoOriginal) &&
    Number.isFinite(produto.preco) &&
    produto.precoOriginal > 0 &&
    produto.preco >= 0 &&
    produto.precoOriginal > produto.preco
  );
}
