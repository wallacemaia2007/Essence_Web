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
 * Os textos e tamanhos abaixo são demonstrativos. Confirme os dados da loja
 * antes de publicar; `produto-01` também exemplifica um tamanho indisponível.
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
    sobre:
      "Vestido midi de decote quadrado, mangas curtas levemente bufantes e cintura marcada. A saia fluida e a estampa botânica em tons suaves compõem um visual delicado para diferentes ocasiões.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta da peça. Evite alvejantes e prefira secagem à sombra para preservar as cores.",
    tamanhos: [
      { rotulo: "PP", disponivel: true },
      { rotulo: "P", disponivel: true },
      { rotulo: "M", disponivel: true },
      { rotulo: "G", disponivel: true },
      { rotulo: "GG", disponivel: false },
    ],
  },
  "vestidos-02": {
    sobre:
      "Vestido midi Serena em tom rosa suave, com decote em V, mangas curtas e faixa para marcar a cintura. A silhueta transpassada traz movimento ao look.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta da peça. Lave com cores semelhantes e evite alvejantes.",
  },
  "vestidos-03": {
    sobre:
      "Vestido midi branco com bordado vazado inspirado em motivos florais, decote arredondado e mangas curtas. Uma peça leve com textura e acabamento delicado.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Por ter detalhes bordados, manuseie com cuidado e siga as instruções de lavagem da etiqueta.",
  },
  "vestidos-04": {
    sobre:
      "Vestido midi Clara em tom areia, sem mangas, com decote quadrado e cinto do mesmo tecido. O corte simples destaca a linha da cintura e mantém o visual versátil.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta da peça. Seque à sombra e passe conforme a recomendação do tecido.",
  },
  "produto-02": {
    sobre:
      "Conjunto Sol de duas peças em amarelo manteiga, composto por blusa de mangas curtas e calça de cintura alta com perna ampla. Use as peças juntas ou combine-as separadamente.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta. Lave as peças com cores semelhantes e seque à sombra.",
  },
  "produto-03": {
    sobre:
      "Conjunto Tricot Aurora em tom canela, formado por blusa sem mangas e calça reta coordenada. A textura canelada cria um conjunto confortável e fácil de combinar.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Para preservar a forma da malha, siga a etiqueta e prefira secagem na horizontal, sem torcer a peça.",
  },
  "conjuntos-verao-02": {
    sobre:
      "Conjunto de Linho Capri em tom natural, com colete abotoado sem mangas e calça de perna ampla. As duas peças podem ser usadas juntas ou em combinações diferentes.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta. O aspecto naturalmente texturizado pode apresentar vincos próprios do tecido.",
  },
  "conjuntos-inverno-02": {
    sobre:
      "Conjunto Veludo Serena em tom vinho, composto por blazer de corte suave e calça reta coordenada. A textura aveludada dá destaque à peça em produções de clima ameno.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta. Para conservar a textura, evite atrito e não use alvejantes.",
  },
  "alfaiataria-03": {
    sobre:
      "Colete Clássico de alfaiataria em tom taupe, com abotoamento frontal e recorte ajustado. Na imagem, aparece combinado com blusa clara e calça de alfaiataria.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta. Preserve o formato dos recortes e botões durante a lavagem e a guarda.",
  },
  "casual-04": {
    sobre:
      "T-shirt Minimal de gola redonda e mangas curtas, em tom claro e modelagem essencial. Uma base versátil para compor looks casuais com jeans, saias ou alfaiataria.",
    composicao:
      "Composição demonstrativa: confirme a fibra e a proporção exatas na etiqueta ou com a equipe Essence antes da compra.",
    cuidados:
      "Siga as instruções da etiqueta. Lave com cores semelhantes e evite temperaturas elevadas ao passar.",
  },
};
