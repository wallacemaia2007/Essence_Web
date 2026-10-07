import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import {
  detalhesPorProduto,
  type FotoProduto,
  type TamanhoProduto,
  tamanhosPadrao,
  textosPadrao,
} from "@/data/produto-detalhes";
import { socialLinks } from "@/data/social";
import { produtosVitrine, type ProdutoVitrine } from "@/data/vitrine";

const produtosPorId = new Map<string, ProdutoVitrine>(
  produtosVitrine.map((produto) => [produto.id, produto]),
);

export type ProdutoDetalhado = {
  produto: ProdutoVitrine;
  referencia: string;
  fotos: readonly FotoProduto[];
  tamanhos: readonly TamanhoProduto[];
  sobre: string;
  composicao: string;
  cuidados: string;
};

export function encontrarProduto(id: string) {
  return produtosPorId.get(id);
}

/** Caminho da página da peça (`/produto/<id>`). */
export function caminhoDoProduto(id: string) {
  return `${routes.produto}/${id}`;
}

export function formatarPreco(preco: number | null | undefined) {
  if (preco == null) {
    return "Preço a cadastrar";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

/**
 * Junta os dados do catálogo com os detalhes de `src/data/produto-detalhes.ts`,
 * preenchendo com valores padrão o que ainda não foi cadastrado.
 */
export function detalharProduto(produto: ProdutoVitrine): ProdutoDetalhado {
  const detalhes = detalhesPorProduto[produto.id];

  const fotosDoCatalogo: FotoProduto[] = [];

  if (produto.imagem) {
    fotosDoCatalogo.push({ src: produto.imagem, alt: produto.alt });
  }

  if (produto.imagemHover) {
    fotosDoCatalogo.push({
      src: produto.imagemHover,
      alt: `${produto.nome}, segunda vista`,
    });
  }

  return {
    produto,
    referencia: detalhes?.referencia ?? `ESS-${produto.id.toUpperCase()}`,
    fotos: detalhes?.fotos ?? fotosDoCatalogo,
    tamanhos: detalhes?.tamanhos ?? tamanhosPadrao,
    sobre: detalhes?.sobre ?? textosPadrao.sobre,
    composicao: detalhes?.composicao ?? textosPadrao.composicao,
    cuidados: detalhes?.cuidados ?? textosPadrao.cuidados,
  };
}

/** Outras peças da mesma coleção, na ordem do catálogo. */
export function produtosRelacionados(produto: ProdutoVitrine, limite = 4) {
  return produtosVitrine
    .filter(
      (item) => item.colecao === produto.colecao && item.id !== produto.id,
    )
    .slice(0, limite);
}

/** Link base do WhatsApp da loja (o mesmo de `src/data/social.ts`). */
export function linkBaseWhatsapp() {
  return (
    socialLinks.find((link) => link.platform === "whatsapp")?.href ??
    `https://wa.me/${contato.whatsapp}`
  );
}
