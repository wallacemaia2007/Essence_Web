export const VITRINE_MAX_PRODUTOS = 6;
export const VITRINE_PRODUTOS_POR_SLIDE = 3;
export const VITRINE_INTERVALO_MS = 5_000;

export type ProdutoVitrine = {
  id: string;
  nome: string;
  /** URL local em `public/`; nula até a foto real ser adicionada. */
  imagem: string | null;
  /** Segunda foto do mesmo produto, exibida suavemente no hover. */
  imagemHover?: string | null;
  alt: string;
  /** Valor em reais; não preencher com preço estimado. */
  preco?: number | null;
  /** Produtos com `featured: true` podem aparecer na vitrine da home. */
  featured: boolean;
};

/**
 * Itens de demonstração da vitrine. Marque `featured: true` nos produtos que
 * devem aparecer na home. A seção respeita a ordem abaixo e exibe no máximo
 * seis itens, em dois slides de três. Substitua os campos pelos dados reais.
 *
 * Para cada produto, coloque a foto principal em `imagem` e, se houver um
 * segundo ângulo, informe-o em `imagemHover` para a troca de imagem no hover.
 */
export const produtosVitrine: readonly ProdutoVitrine[] = [
  {
    id: "produto-01",
    nome: "Nome da peça 01",
    imagem: null,
    imagemHover: null,
    alt: "Foto da peça 01",
    preco: null,
    featured: true,
  },
  {
    id: "produto-02",
    nome: "Nome da peça 02",
    imagem: null,
    imagemHover: null,
    alt: "Foto da peça 02",
    preco: null,
    featured: true,
  },
  {
    id: "produto-03",
    nome: "Nome da peça 03",
    imagem: null,
    imagemHover: null,
    alt: "Foto da peça 03",
    preco: null,
    featured: true,
  },
  {
    id: "produto-04",
    nome: "Nome da peça 04",
    imagem: null,
    imagemHover: null,
    alt: "Foto da peça 04",
    preco: null,
    featured: true,
  },
  {
    id: "produto-05",
    nome: "Nome da peça 05",
    imagem: null,
    imagemHover: null,
    alt: "Foto da peça 05",
    preco: null,
    featured: true,
  },
  {
    id: "produto-06",
    nome: "Nome da peça 06",
    imagem: null,
    imagemHover: null,
    alt: "Foto da peça 06",
    preco: null,
    featured: true,
  },
];
