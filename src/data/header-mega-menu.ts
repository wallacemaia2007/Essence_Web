import { novidadesData } from "@/data/novidades";
import { produtosVitrine, type ProdutoVitrine } from "@/data/vitrine";

const produtosPorId = new Map(
  produtosVitrine.map((produto) => [produto.id, produto]),
);

const idsNovidades = new Set(
  novidadesData.itens
    .map((item) => item.href.split("/").pop())
    .filter((id): id is string => Boolean(id)),
);

const novidades = novidadesData.itens
  .map((item) => produtosPorId.get(item.href.split("/").pop() ?? ""))
  .filter((produto): produto is ProdutoVitrine => produto !== undefined);

const destaques = produtosVitrine
  .filter((produto) => produto.featured && !idsNovidades.has(produto.id))
  .slice(0, 4);

const outrasPecas = produtosVitrine
  .filter((produto) => !produto.featured && !idsNovidades.has(produto.id))
  .slice(0, 4);

/** Seleções únicas usadas pelas prateleiras do mega menu desktop e mobile. */
export const megaMenuProducts = {
  novidades,
  destaques,
  outrasPecas,
} as const;
