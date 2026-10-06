export const VITRINE_MAX_PRODUTOS = 6;
export const VITRINE_PRODUTOS_POR_SLIDE = 3;
export const VITRINE_INTERVALO_MS = 5_000;

export type ProdutoVitrine = {
  id: string;
  nome: string;
  colecao: string;
  /** URL local em `public/`; nula até a foto real ser adicionada. */
  imagem: string | null;
  /** Segunda foto do mesmo produto, exibida suavemente no hover. */
  imagemHover?: string | null;
  alt: string;
  /** Preço em reais; os valores desta lista são fictícios para demonstração. */
  preco?: number | null;
  /** Produtos com `featured: true` podem aparecer na vitrine da home. */
  featured: boolean;
  /** Destaque exclusivo da página da própria coleção; não altera a vitrine da home. */
  destaqueColecao?: boolean;
};

type ItemDemonstracao = {
  nome: string;
  preco: number;
};

type ColecaoDemonstracao = {
  id: string;
  nome: string;
  itens: readonly ItemDemonstracao[];
};

/**
 * Catálogo de demonstração: 12 peças por conjunto (72 no total).
 * Nomes e preços são fictícios; as fotos ficam pendentes até receber os arquivos
 * reais. Substitua estes dados antes de publicar o catálogo da loja.
 */
const colecoesDeDemonstracao = [
  {
    id: "vestidos",
    nome: "Vestidos",
    itens: [
      { nome: "Vestido Aurora", preco: 249 },
      { nome: "Vestido Midi Serena", preco: 289 },
      { nome: "Vestido Laise Floral", preco: 219 },
      { nome: "Vestido de Linho Clara", preco: 329 },
      { nome: "Vestido Envelope Luna", preco: 259 },
      { nome: "Vestido Canelado Nara", preco: 199 },
      { nome: "Vestido Longo Amélia", preco: 349 },
      { nome: "Vestido Chemise Laura", preco: 239 },
      { nome: "Vestido Midi Olívia", preco: 279 },
      { nome: "Vestido Floral Cecília", preco: 269 },
      { nome: "Vestido Midi Valentina", preco: 299 },
      { nome: "Vestido Floral Marília", preco: 319 },
    ],
  },
  {
    id: "conjuntos-verao",
    nome: "Conjuntos Verão",
    itens: [
      { nome: "Conjunto Sol", preco: 289 },
      { nome: "Conjunto de Linho Capri", preco: 329 },
      { nome: "Conjunto Breeze", preco: 259 },
      { nome: "Conjunto Floral Brisa", preco: 349 },
      { nome: "Conjunto Areia", preco: 299 },
      { nome: "Conjunto Maré", preco: 279 },
      { nome: "Conjunto Duna", preco: 319 },
      { nome: "Conjunto Sunset", preco: 359 },
      { nome: "Conjunto Tropical", preco: 289 },
      { nome: "Conjunto Capri", preco: 339 },
      { nome: "Conjunto Listras Riviera", preco: 299 },
      { nome: "Conjunto Oásis", preco: 309 },
    ],
  },
  {
    id: "conjuntos-inverno",
    nome: "Conjuntos Inverno",
    itens: [
      { nome: "Conjunto Tricot Aurora", preco: 389 },
      { nome: "Conjunto Veludo Serena", preco: 429 },
      { nome: "Conjunto Moletom Chic", preco: 359 },
      { nome: "Conjunto Elegance Inverno", preco: 449 },
      { nome: "Conjunto Knit Nuvem", preco: 399 },
      { nome: "Conjunto Soft Classic", preco: 379 },
      { nome: "Conjunto Cashmere Urbano", preco: 459 },
      { nome: "Conjunto Cardigan Jade", preco: 419 },
      { nome: "Conjunto Grafite", preco: 369 },
      { nome: "Conjunto Tricot Carmim", preco: 439 },
      { nome: "Conjunto Canelado Marfim", preco: 429 },
      { nome: "Conjunto Tricot Valentina", preco: 469 },
    ],
  },
  {
    id: "alfaiataria",
    nome: "Alfaiataria",
    itens: [
      { nome: "Blazer Luna", preco: 499 },
      { nome: "Calça Pantalona de Alfaiataria", preco: 359 },
      { nome: "Colete Clássico", preco: 279 },
      { nome: "Conjunto Office", preco: 579 },
      { nome: "Blazer Maya", preco: 529 },
      { nome: "Calça Reta Siena", preco: 329 },
      { nome: "Colete Alongado", preco: 299 },
      { nome: "Conjunto Tailleur", preco: 649 },
      { nome: "Blazer Estruturado", preco: 539 },
      { nome: "Calça Cenoura Clara", preco: 339 },
      { nome: "Colete Alfaiataria Siena", preco: 319 },
      { nome: "Calça Alfaiataria Íris", preco: 379 },
    ],
  },
  {
    id: "festa",
    nome: "Festa",
    itens: [
      { nome: "Vestido Noite Estrelada", preco: 599 },
      { nome: "Vestido Glamour", preco: 549 },
      { nome: "Macacão Luna", preco: 429 },
      { nome: "Vestido Paetê", preco: 649 },
      { nome: "Saia de Cetim", preco: 359 },
      { nome: "Blusa Brilho", preco: 289 },
      { nome: "Conjunto Dourado", preco: 489 },
      { nome: "Vestido Longo Aurora", preco: 699 },
      { nome: "Macacão Elegance", preco: 459 },
      { nome: "Vestido Midi Lúmina", preco: 579 },
      { nome: "Vestido Festa Aurora", preco: 629 },
      { nome: "Conjunto Cetim Jade", preco: 519 },
    ],
  },
  {
    id: "casual",
    nome: "Casual",
    itens: [
      { nome: "Blusa Essencial", preco: 169 },
      { nome: "Jeans Reto Clara", preco: 299 },
      { nome: "Camisa de Linho", preco: 219 },
      { nome: "T-shirt Minimal", preco: 119 },
      { nome: "Saia Midi Serena", preco: 229 },
      { nome: "Calça Wide Leg", preco: 279 },
      { nome: "Regata Canelada", preco: 99 },
      { nome: "Cardigan Leve", preco: 259 },
      { nome: "Shorts de Alfaiataria Casual", preco: 239 },
      { nome: "Blusa Tricot Soft", preco: 189 },
      { nome: "Camisa Casual Jade", preco: 209 },
      { nome: "Macaquinho Leve Solar", preco: 249 },
    ],
  },
] satisfies readonly ColecaoDemonstracao[];

export const produtosVitrine: readonly ProdutoVitrine[] =
  colecoesDeDemonstracao.flatMap((colecao, indiceColecao) =>
    colecao.itens.map((item, indiceItem) => ({
      id:
        indiceItem === 0
          ? `produto-${String(indiceColecao + 1).padStart(2, "0")}`
          : `${colecao.id}-${String(indiceItem + 1).padStart(2, "0")}`,
      nome: item.nome,
      colecao: colecao.nome,
      imagem: null,
      imagemHover: null,
      alt: `Foto demonstrativa de ${item.nome}`,
      preco: item.preco,
      // Só o primeiro de cada conjunto entra na vitrine geral da home (6 no total).
      featured: indiceItem === 0,
      // Três peças por conjunto preenchem a prateleira de destaques individual.
      destaqueColecao: indiceItem < VITRINE_PRODUTOS_POR_SLIDE,
    })),
  );
