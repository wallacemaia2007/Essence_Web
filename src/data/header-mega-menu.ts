import { novidadesData } from "@/data/novidades";
import {
  CATEGORIAS_PRODUTO,
  produtosVitrine,
  type ProdutoVitrine,
} from "@/data/vitrine";

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

const MAX_MEGA_MENU_CATEGORIES = 10;

export const megaMenuCategories = CATEGORIAS_PRODUTO.map(
  (categoria, ordem) => ({
    categoria,
    ordem,
    quantidade: produtosVitrine.filter(
      (produto) => produto.categoria === categoria,
    ).length,
  }),
)
  .filter(({ quantidade }) => quantidade > 0)
  .sort((a, b) => b.quantidade - a.quantidade || a.ordem - b.ordem)
  .slice(0, MAX_MEGA_MENU_CATEGORIES)
  .map(({ categoria }) => categoria);

/** Seleções únicas usadas pelas prateleiras do mega menu desktop e mobile. */
export const megaMenuProducts = {
  novidades,
  destaques,
  outrasPecas,
} as const;
