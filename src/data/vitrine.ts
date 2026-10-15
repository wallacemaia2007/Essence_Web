export const VITRINE_MAX_PRODUTOS = 6;
export const VITRINE_PRODUTOS_POR_SLIDE = 3;
export const VITRINE_INTERVALO_MS = 5_000;

export const CATEGORIAS_PRODUTO = [
  "Vestidos",
  "Conjuntos",
  "Calças",
  "Blusas",
  "Croppeds",
  "Camisas",
  "T-shirts",
  "Regatas",
  "Saias",
  "Shorts",
  "Blazers",
  "Coletes",
  "Macacões e macaquinhos",
  "Cardigans",
  "Bolsas",
  "Acessórios",
] as const;

export type CategoriaProduto = (typeof CATEGORIAS_PRODUTO)[number];

export type ProdutoCor = {
  name: string;
  hex: string;
  images?: string[];
};

export type ProdutoVitrine = {
  id: string;
  nome: string;
  categoria: CategoriaProduto;
  colecao: string;
  /** URL local em `public/`; null enquanto não houver uma imagem associada. */
  imagem: string | null;
  /** Segunda foto do mesmo produto, exibida suavemente no hover. */
  imagemHover?: string | null;
  /** Fotos da galeria, em ordem. Use [] até a loja fornecer fotos reais. */
  images: string[];
  /** TODO: cadastrar cores, tons e fotos de cada variante somente após confirmação da loja. */
  colors?: ProdutoCor[];
  /** IDs explícitos para completar o look; vazio usa itens da mesma coleção. */
  lookWith?: string[];
  alt: string;
  /** Preço em reais; os valores desta lista são fictícios para demonstração. */
  preco?: number | null;
  /** Preço anterior demonstrativo; a loja deve confirmar antes de publicar. */
  precoOriginal?: number;
  /** Marca se a peça deve aparecer na página Outlet. */
  outlet?: boolean;
  /** Produtos com `featured: true` podem aparecer na vitrine da home. */
  featured: boolean;
  /** Destaque exclusivo da página da própria coleção; não altera a vitrine da home. */
  destaqueColecao?: boolean;
};

type ItemDemonstracao = {
  nome: string;
  preco: number;
  categoria: CategoriaProduto;
};

type ColecaoDemonstracao = {
  id: string;
  nome: string;
  itens: readonly ItemDemonstracao[];
};

/**
 * Catálogo de demonstração: 12 peças por conjunto (72 no total).
 * Nomes, preços e algumas imagens são demonstrativos; confirme os dados reais
 * da loja antes de publicar o catálogo.
 */
const colecoesDeDemonstracao = [
  {
    id: "vestidos",
    nome: "Vestidos",
    itens: [
      { nome: "Vestido Midi Aurora", preco: 249, categoria: "Vestidos" },
      { nome: "Vestido Midi Serena", preco: 289, categoria: "Vestidos" },
      { nome: "Vestido Laise Floral", preco: 219, categoria: "Vestidos" },
      { nome: "Vestido de Linho Clara", preco: 329, categoria: "Vestidos" },
      { nome: "Vestido Envelope Luna", preco: 259, categoria: "Vestidos" },
      { nome: "Vestido Canelado Nara", preco: 199, categoria: "Vestidos" },
      { nome: "Vestido Longo Amélia", preco: 349, categoria: "Vestidos" },
      { nome: "Vestido Chemise Laura", preco: 239, categoria: "Vestidos" },
      { nome: "Vestido Midi Olívia", preco: 279, categoria: "Vestidos" },
      { nome: "Vestido Floral Cecília", preco: 269, categoria: "Vestidos" },
      { nome: "Vestido Midi Valentina", preco: 299, categoria: "Vestidos" },
      { nome: "Vestido Floral Marília", preco: 319, categoria: "Vestidos" },
    ],
  },
  {
    id: "conjuntos-verao",
    nome: "Conjuntos Verão",
    itens: [
      { nome: "Conjunto Sol", preco: 289, categoria: "Conjuntos" },
      { nome: "Conjunto de Linho Capri", preco: 329, categoria: "Conjuntos" },
      { nome: "Conjunto Breeze", preco: 259, categoria: "Conjuntos" },
      { nome: "Conjunto Floral Brisa", preco: 349, categoria: "Conjuntos" },
      { nome: "Conjunto Areia", preco: 299, categoria: "Conjuntos" },
      { nome: "Conjunto Maré", preco: 279, categoria: "Conjuntos" },
      { nome: "Conjunto Duna", preco: 319, categoria: "Conjuntos" },
      { nome: "Conjunto Sunset", preco: 359, categoria: "Conjuntos" },
      { nome: "Conjunto Tropical", preco: 289, categoria: "Conjuntos" },
      { nome: "Conjunto Capri", preco: 339, categoria: "Conjuntos" },
      { nome: "Conjunto Listras Riviera", preco: 299, categoria: "Conjuntos" },
      { nome: "Conjunto Oásis", preco: 309, categoria: "Conjuntos" },
    ],
  },
  {
    id: "conjuntos-inverno",
    nome: "Conjuntos Inverno",
    itens: [
      { nome: "Conjunto Tricot Aurora", preco: 389, categoria: "Conjuntos" },
      { nome: "Conjunto Veludo Serena", preco: 429, categoria: "Conjuntos" },
      { nome: "Conjunto Moletom Chic", preco: 359, categoria: "Conjuntos" },
      { nome: "Conjunto Elegance Inverno", preco: 449, categoria: "Conjuntos" },
      { nome: "Conjunto Knit Nuvem", preco: 399, categoria: "Conjuntos" },
      { nome: "Conjunto Soft Classic", preco: 379, categoria: "Conjuntos" },
      { nome: "Conjunto Cashmere Urbano", preco: 459, categoria: "Conjuntos" },
      { nome: "Conjunto Cardigan Jade", preco: 419, categoria: "Conjuntos" },
      { nome: "Conjunto Grafite", preco: 369, categoria: "Conjuntos" },
      { nome: "Conjunto Tricot Carmim", preco: 439, categoria: "Conjuntos" },
      { nome: "Conjunto Canelado Marfim", preco: 429, categoria: "Conjuntos" },
      { nome: "Conjunto Tricot Valentina", preco: 469, categoria: "Conjuntos" },
    ],
  },
  {
    id: "alfaiataria",
    nome: "Alfaiataria",
    itens: [
      { nome: "Blazer Luna", preco: 499, categoria: "Blazers" },
      {
        nome: "Calça Pantalona de Alfaiataria",
        preco: 359,
        categoria: "Calças",
      },
      { nome: "Colete Clássico", preco: 279, categoria: "Coletes" },
      { nome: "Conjunto Office", preco: 579, categoria: "Conjuntos" },
      { nome: "Blazer Maya", preco: 529, categoria: "Blazers" },
      { nome: "Calça Reta Siena", preco: 329, categoria: "Calças" },
      { nome: "Colete Alongado", preco: 299, categoria: "Coletes" },
      { nome: "Conjunto Tailleur", preco: 649, categoria: "Conjuntos" },
      { nome: "Blazer Estruturado", preco: 539, categoria: "Blazers" },
      { nome: "Calça Cenoura Clara", preco: 339, categoria: "Calças" },
      { nome: "Colete Alfaiataria Siena", preco: 319, categoria: "Coletes" },
      { nome: "Calça Alfaiataria Íris", preco: 379, categoria: "Calças" },
    ],
  },
  {
    id: "festa",
    nome: "Festa",
    itens: [
      { nome: "Vestido Noite Estrelada", preco: 599, categoria: "Vestidos" },
      { nome: "Vestido Glamour", preco: 549, categoria: "Vestidos" },
      { nome: "Macacão Luna", preco: 429, categoria: "Macacões e macaquinhos" },
      { nome: "Vestido Paetê", preco: 649, categoria: "Vestidos" },
      { nome: "Saia de Cetim", preco: 359, categoria: "Saias" },
      { nome: "Blusa Brilho", preco: 289, categoria: "Blusas" },
      { nome: "Conjunto Dourado", preco: 489, categoria: "Conjuntos" },
      { nome: "Vestido Longo Aurora", preco: 699, categoria: "Vestidos" },
      {
        nome: "Macacão Elegance",
        preco: 459,
        categoria: "Macacões e macaquinhos",
      },
      { nome: "Vestido Midi Lúmina", preco: 579, categoria: "Vestidos" },
      { nome: "Vestido Festa Aurora", preco: 629, categoria: "Vestidos" },
      { nome: "Conjunto Cetim Jade", preco: 519, categoria: "Conjuntos" },
    ],
  },
  {
    id: "casual",
    nome: "Casual",
    itens: [
      { nome: "Blusa Essencial", preco: 169, categoria: "Blusas" },
      { nome: "Jeans Reto Clara", preco: 299, categoria: "Calças" },
      { nome: "Camisa de Linho", preco: 219, categoria: "Camisas" },
      { nome: "T-shirt Minimal", preco: 119, categoria: "T-shirts" },
      { nome: "Saia Midi Serena", preco: 229, categoria: "Saias" },
      { nome: "Calça Wide Leg", preco: 279, categoria: "Calças" },
      { nome: "Regata Canelada", preco: 99, categoria: "Regatas" },
      { nome: "Cardigan Leve", preco: 259, categoria: "Cardigans" },
      { nome: "Shorts de Alfaiataria Casual", preco: 239, categoria: "Shorts" },
      { nome: "Blusa Tricot Soft", preco: 189, categoria: "Blusas" },
      { nome: "Camisa Casual Jade", preco: 209, categoria: "Camisas" },
      {
        nome: "Macaquinho Leve Solar",
        preco: 249,
        categoria: "Macacões e macaquinhos",
      },
    ],
  },
] satisfies readonly ColecaoDemonstracao[];

// TODO: substituir estes preços anteriores demonstrativos pelos valores reais confirmados pela loja.
const precosOriginaisOutletDemonstrativos: Record<string, number> = {
  "vestidos-02": 359,
  "vestidos-03": 279,
  "conjuntos-verao-02": 399,
  "conjuntos-inverno-02": 499,
  "alfaiataria-03": 329,
  "casual-04": 149,
};

const imagensDemonstrativasPorId: Readonly<
  Record<string, { imagem: string; alt: string }>
> = {
  "produto-01": {
    imagem: "/images/products/vestido-aurora-01.webp",
    alt: "Modelo usando vestido midi marfim com estampa botânica delicada",
  },
  "vestidos-02": {
    imagem: "/images/products/vestido-serena-midi.webp",
    alt: "Modelo usando vestido midi rosa com faixa na cintura",
  },
  "vestidos-03": {
    imagem: "/images/products/vestido-laise-floral.webp",
    alt: "Modelo usando vestido branco bordado em laise floral",
  },
  "vestidos-04": {
    imagem: "/images/products/vestido-linho-clara.webp",
    alt: "Modelo usando vestido midi bege com cinto e decote quadrado",
  },
  "produto-02": {
    imagem: "/images/products/conjunto-sol.webp",
    alt: "Modelo usando conjunto amarelo de blusa e calça ampla",
  },
  "produto-03": {
    imagem: "/images/products/conjunto-tricot-aurora.webp",
    alt: "Modelo usando conjunto canelado de tricot em tom canela",
  },
  "conjuntos-verao-02": {
    imagem: "/images/products/conjunto-linho-capri.webp",
    alt: "Modelo usando conjunto natural de colete e calça ampla",
  },
  "conjuntos-inverno-02": {
    imagem: "/images/products/conjunto-veludo-serena.webp",
    alt: "Modelo usando conjunto de veludo vinho com blazer e calça",
  },
  "alfaiataria-03": {
    imagem: "/images/products/colete-classico.webp",
    alt: "Modelo usando colete taupe de alfaiataria sobre blusa clara",
  },
  "casual-04": {
    imagem: "/images/products/t-shirt-minimal.webp",
    alt: "Modelo usando camiseta clara minimalista com jeans escuro",
  },
};

export const produtosVitrine: readonly ProdutoVitrine[] =
  colecoesDeDemonstracao.flatMap((colecao, indiceColecao) =>
    colecao.itens.map((item, indiceItem) => {
      const id =
        indiceItem === 0
          ? `produto-${String(indiceColecao + 1).padStart(2, "0")}`
          : `${colecao.id}-${String(indiceItem + 1).padStart(2, "0")}`;
      const precoOriginal = precosOriginaisOutletDemonstrativos[id];
      const fotografia = imagensDemonstrativasPorId[id];

      return {
        id,
        nome: item.nome,
        categoria: item.categoria,
        colecao: colecao.nome,
        imagem: fotografia?.imagem ?? null,
        imagemHover: null,
        images: fotografia ? [fotografia.imagem] : [],
        alt: fotografia?.alt ?? `Foto demonstrativa de ${item.nome}`,
        preco: item.preco,
        ...(precoOriginal ? { precoOriginal, outlet: true } : {}),
        // Só o primeiro de cada conjunto entra na vitrine geral da home (6 no total).
        featured: indiceItem === 0,
        // Três peças por conjunto preenchem a prateleira de destaques individual.
        destaqueColecao: indiceItem < VITRINE_PRODUTOS_POR_SLIDE,
      };
    }),
  );
