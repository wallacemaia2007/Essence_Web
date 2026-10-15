/**
 * Índice client-side de busca para páginas, categorias, conjuntos e produtos.
 * Não usa backend nem serviços externos.
 */
import { anchors, routes } from "@/constants/routes";
import { conjuntosData } from "@/data/conjuntos";
import { CATEGORIAS_PRODUTO, produtosVitrine } from "@/data/vitrine";

export type SiteSearchEntry = {
  label: string;
  description: string;
  href: string;
  kind: "Peça" | "Categoria" | "Conjunto" | "Coleção" | "Página";
  image?: string | null;
  keywords?: readonly string[];
};

const pageEntries: SiteSearchEntry[] = [
  {
    label: "Início",
    description: "Página inicial da Essence",
    href: routes.home,
    kind: "Página",
  },
  {
    label: "Sobre",
    description: "Conheça a Essence e o projeto",
    href: routes.sobre,
    kind: "Página",
  },
  {
    label: "Contato",
    description: "Fale com a loja",
    href: routes.contato,
    kind: "Página",
  },
  {
    label: "Favoritos",
    description: "Peças que você marcou com o coração",
    href: routes.favoritos,
    kind: "Página",
  },
  {
    label: "Localização",
    description: "Loja física em Passos — MG",
    href: `${routes.home}#localizacao`,
    kind: "Página",
  },
  {
    label: "Redes sociais",
    description: "Instagram da Essence",
    href: `${routes.home}#redes-sociais`,
    kind: "Página",
  },
  {
    label: "Conjuntos",
    description: "Coleções e conjuntos em destaque",
    href: `${routes.home}#conjuntos`,
    kind: "Página",
  },
  {
    label: "Sobre a loja",
    description: "Nossa história e presença",
    href: `${routes.home}#sobre-a-loja`,
    kind: "Página",
  },
  {
    label: "Novidades",
    description: "Lançamentos recentes",
    href: `${routes.home}#novidades`,
    kind: "Página",
  },
  {
    label: "Perguntas frequentes",
    description: "Dúvidas sobre pedidos, trocas e entrega",
    href: anchors.faq,
    kind: "Página",
  },
];

const categoryEntries: SiteSearchEntry[] = CATEGORIAS_PRODUTO.map(
  (categoria) => {
    const quantidade = produtosVitrine.filter(
      (produto) => produto.categoria === categoria,
    ).length;

    return {
      label: categoria,
      description: `Categoria · ${quantidade} ${quantidade === 1 ? "peça" : "peças"}`,
      href: `${routes.colecao}?categoria=${encodeURIComponent(categoria)}`,
      kind: "Categoria",
    };
  },
);

const collectionEntries: SiteSearchEntry[] = conjuntosData.itens.map(
  (conjunto) => ({
    label: conjunto.titulo,
    description: conjunto.descricao ?? "Explore esta coleção da Essence",
    href:
      conjunto.href ??
      `${routes.colecao}?busca=${encodeURIComponent(conjunto.titulo)}`,
    kind: conjunto.titulo.toLocaleLowerCase("pt-BR").startsWith("conjunto")
      ? "Conjunto"
      : "Coleção",
    keywords: [conjunto.id],
  }),
);

const productEntries: SiteSearchEntry[] = produtosVitrine.map((produto) => ({
  label: produto.nome,
  description: `${produto.categoria} · ${produto.colecao}`,
  href: `${routes.produto}/${encodeURIComponent(produto.id)}`,
  kind: "Peça",
  image: produto.imagem,
  keywords: [produto.categoria, produto.colecao, produto.id],
}));

/** O índice vem dos dados reais do catálogo e é pesquisado inteiramente no cliente. */
export const siteSearchIndex: readonly SiteSearchEntry[] = [
  ...categoryEntries,
  ...collectionEntries,
  ...productEntries,
  ...pageEntries,
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function relevance(entry: SiteSearchEntry, query: string, terms: string[]) {
  const label = normalize(entry.label);
  const fields = normalize(
    [entry.description, ...(entry.keywords ?? [])].join(" "),
  );
  const searchableText = `${label} ${fields}`;

  if (!terms.every((term) => searchableText.includes(term))) return -1;

  let score = 0;
  if (
    entry.kind === "Categoria" &&
    label
      .split(/\s+/)
      .some((word) => word === `${query}s` || query === `${word}s`)
  ) {
    score += 1_000;
  }

  if (label === query) score += 1_000;
  else if (label.startsWith(query)) score += 800;
  else if (label.includes(query)) score += 600;

  const labelWords = label.split(/\s+/);
  for (const term of terms) {
    if (labelWords.includes(term)) score += 120;
    else if (labelWords.some((word) => word.startsWith(term))) score += 80;
    else if (label.includes(term)) score += 50;
    else score += 20;
  }

  return score;
}

const kindPriority: Record<SiteSearchEntry["kind"], number> = {
  Categoria: 5,
  Conjunto: 4,
  Coleção: 3,
  Peça: 2,
  Página: 1,
};

/** Retorna no máximo três sugestões, ordenadas pela correspondência mais forte. */
export function searchSite(query: string): SiteSearchEntry[] {
  const normalized = normalize(query);
  if (!normalized) return [];

  const terms = normalized.split(/\s+/).filter(Boolean);

  return siteSearchIndex
    .map((entry) => ({ entry, score: relevance(entry, normalized, terms) }))
    .filter(({ score }) => score >= 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        kindPriority[b.entry.kind] - kindPriority[a.entry.kind] ||
        a.entry.label.localeCompare(b.entry.label, "pt-BR"),
    )
    .slice(0, 3)
    .map(({ entry }) => entry);
}
