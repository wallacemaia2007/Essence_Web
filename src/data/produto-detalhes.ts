export type TamanhoProduto = {
  /** Rótulo exibido no seletor (ex.: "PP", "M", "38"). */
  rotulo: string;
  /** `false` mantém o tamanho visível, mas riscado e sem poder ser escolhido. */
  disponivel: boolean;
};

export type FotoProduto = {
  /** Caminho em `public/` (ex.: `/images/produtos/vestido-aurora-01.webp`). */
  src: string;
  alt: string;
};

/**
 * Informações extras da página da peça. Tudo é opcional: o que não for
 * informado cai nos valores padrão abaixo (ver `detalharProduto` em
 * `src/lib/produto.ts`).
 */
export type DetalhesProduto = {
  /** Código interno exibido como "Ref.:". Padrão: gerado a partir do id. */
  referencia?: string;
  /**
   * Fotos da peça, na ordem da galeria (a primeira é a principal). Sem isto, a
   * página usa `imagem` e `imagemHover` de `src/data/vitrine.ts`.
   */
  fotos?: readonly FotoProduto[];
  /** Tamanhos da peça. Padrão: `tamanhosPadrao`, todos disponíveis. */
  tamanhos?: readonly TamanhoProduto[];
  /** Texto "Sobre o produto". Separe parágrafos com uma linha em branco. */
  sobre?: string;
  /** Texto "Composição". */
  composicao?: string;
  /** Texto "Cuidados com o produto". */
  cuidados?: string;
};

export const tamanhosPadrao: readonly TamanhoProduto[] = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
].map((rotulo) => ({ rotulo, disponivel: true }));

/** PLACEHOLDER: textos exibidos enquanto a peça não tem texto próprio. */
export const textosPadrao = {
  sobre:
    "Em breve, mais detalhes sobre esta peça. Fale com a nossa equipe para saber mais sobre modelagem e caimento.",
  composicao:
    "Composição em breve. Você também encontra essa informação na etiqueta da peça, na loja.",
  cuidados:
    "Siga sempre as instruções da etiqueta. Em caso de dúvida, lave à mão com sabão neutro e evite alvejante.",
} as const;

/**
 * Detalhes por peça, indexados pelo `id` de `src/data/vitrine.ts`.
 *
 * Exemplo abaixo (peça `produto-01`): GG indisponível, para você ver como o
 * tamanho esgotado aparece. Troque pelos dados reais ou apague o exemplo.
 *
 * Para incluir fotos:
 *   fotos: [
 *     { src: "/images/produtos/vestido-aurora-01.webp", alt: "Vestido Aurora, vista frontal" },
 *     { src: "/images/produtos/vestido-aurora-02.webp", alt: "Vestido Aurora, costas" },
 *   ],
 * (WebP vertical 2:3, ~1200×1800, até ~250 KB cada.)
 */
export const detalhesPorProduto: Readonly<Record<string, DetalhesProduto>> = {
  "produto-01": {
    tamanhos: [
      { rotulo: "PP", disponivel: true },
      { rotulo: "P", disponivel: true },
      { rotulo: "M", disponivel: true },
      { rotulo: "G", disponivel: true },
      { rotulo: "GG", disponivel: false },
    ],
  },
};
