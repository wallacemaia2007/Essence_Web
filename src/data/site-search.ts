/**
 * Índices client-side de páginas e produtos para os diálogos de busca.
 * As entradas são derivadas dos dados locais; nenhuma API de busca é usada.
 */
import { anchors, routes } from "@/constants/routes";
import { testimonials } from "@/data/testimonials";
import { CATEGORIAS_PRODUTO, produtosVitrine } from "@/data/vitrine";

export type SiteSearchEntry = {
  label: string;
  description: string;
  href: string;
};

export type CatalogSearchSuggestion = {
  id: string;
  label: string;
  description: string;
  value: string;
  type: "product" | "category";
};

export function normalizarBusca(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

const termosDeBuscaProduto = produtosVitrine.map((produto) => ({
  id: produto.id,
  nome: produto.nome,
  categoria: produto.categoria,
}));

const categoriasDeBusca = CATEGORIAS_PRODUTO.map((categoria) => ({
  nome: categoria,
  quantidade: termosDeBuscaProduto.filter(
    (produto) => produto.categoria === categoria,
  ).length,
})).filter((categoria) => categoria.quantidade > 0);

export const siteSearchIndex: readonly SiteSearchEntry[] = [
  {
    label: "Início",
    description: "Página inicial da Essence",
    href: routes.home,
  },
  {
    label: "Sobre",
    description: "Conheça a Essence e o projeto",
    href: routes.sobre,
  },
  {
    label: "Clube da Essence",
    description: "Conheça o Clube da Essence",
    href: routes.clube,
  },
  {
    label: "Contato",
    description: "Fale com a loja",
    href: routes.contato,
  },
  {
    label: "Favoritos",
    description: "Peças que você marcou com o coração",
    href: routes.favoritos,
  },
  {
    label: "Localização",
    description: "Loja física em Passos — MG",
    href: `${routes.home}#localizacao`,
  },
  {
    label: "Redes sociais",
    description: "Instagram da Essence",
    href: `${routes.home}#redes-sociais`,
  },
  {
    label: "Conjuntos",
    description: "Coleções e conjuntos em destaque",
    href: `${routes.home}#conjuntos`,
  },
  {
    label: "Sobre a loja",
    description: "Nossa história e presença",
    href: `${routes.home}#sobre-a-loja`,
  },
  {
    label: "Novidades",
    description: "Lançamentos recentes",
    href: `${routes.home}#novidades`,
  },
  {
    label: "Perguntas frequentes",
    description: "Dúvidas sobre pedidos, trocas e entrega",
    href: anchors.faq,
  },
  ...(testimonials.some((item) => item.published)
    ? [
        {
          label: "Depoimentos",
          description: "Experiências das clientes Essence",
          href: anchors.depoimentos,
        },
      ]
    : []),
];

export function searchSite(query: string): SiteSearchEntry[] {
  const normalized = normalizarBusca(query);

  if (!normalized) {
    return [];
  }

  return siteSearchIndex.filter((entry) => {
    const haystack = normalizarBusca(`${entry.label} ${entry.description}`);

    return normalized.split(/\s+/).every((term) => haystack.includes(term));
  });
}

export function searchCatalog(query: string) {
  const normalized = normalizarBusca(query);
  if (!normalized) return { products: [], categories: [] };

  const terms = normalized.split(/\s+/);
  const matches = (value: string) => {
    const haystack = normalizarBusca(value);
    return terms.every((term) => haystack.includes(term));
  };

  const products: CatalogSearchSuggestion[] = termosDeBuscaProduto
    .filter((produto) => matches(`${produto.nome} ${produto.categoria}`))
    .slice(0, 5)
    .map((produto) => ({
      id: `product-${produto.id}`,
      label: produto.nome,
      description: produto.categoria,
      value: produto.nome,
      type: "product",
    }));

  const categories: CatalogSearchSuggestion[] = categoriasDeBusca
    .filter((categoria) => matches(categoria.nome))
    .slice(0, 5)
    .map((categoria) => ({
      id: `category-${normalizarBusca(categoria.nome)}`,
      label: categoria.nome,
      description: `${categoria.quantidade} ${categoria.quantidade === 1 ? "peça" : "peças"}`,
      value: categoria.nome,
      type: "category",
    }));

  return { products, categories };
}

export function getPopularSearchCategories(): CatalogSearchSuggestion[] {
  return [...categoriasDeBusca]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 4)
    .map((categoria) => ({
      id: `category-${normalizarBusca(categoria.nome)}`,
      label: categoria.nome,
      description: `${categoria.quantidade} ${categoria.quantidade === 1 ? "peça" : "peças"}`,
      value: categoria.nome,
      type: "category",
    }));
}
