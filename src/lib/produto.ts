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
  images: string[];
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

  const imagensDoCatalogo = [
    ...produto.images,
    ...(produto.imagem ? [produto.imagem] : []),
    ...(produto.imagemHover ? [produto.imagemHover] : []),
  ];
  const fotosDoCatalogo = [...new Set(imagensDoCatalogo)].map(
    (src, indice): FotoProduto => ({
      src,
      alt: indice === 0 ? produto.alt : `${produto.nome}, foto ${indice + 1}`,
    }),
  );
  const fotos = detalhes?.fotos ?? fotosDoCatalogo;

  return {
    produto,
    referencia: detalhes?.referencia ?? `ESS-${produto.id.toUpperCase()}`,
    images: fotos.map((foto) => foto.src),
    fotos,
    tamanhos: detalhes?.tamanhos ?? tamanhosPadrao,
    sobre: detalhes?.sobre ?? textosPadrao.sobre,
    composicao: detalhes?.composicao ?? textosPadrao.composicao,
    cuidados: detalhes?.cuidados ?? textosPadrao.cuidados,
  };
}

/** Usa IDs cadastrados em lookWith e completa com peças da mesma coleção. */
export function produtosRelacionados(produto: ProdutoVitrine, limite = 4) {
  const indicados = (produto.lookWith ?? [])
    .map((id) => produtosPorId.get(id))
    .filter((item): item is ProdutoVitrine =>
      Boolean(item && item.id !== produto.id),
    );
  const idsIndicados = new Set(indicados.map((item) => item.id));
  const complementos = produtosVitrine.filter(
    (item) =>
      item.colecao === produto.colecao &&
      item.id !== produto.id &&
      !idsIndicados.has(item.id),
  );

  return [...indicados, ...complementos].slice(0, limite);
}

/** Link base do WhatsApp da loja (o mesmo de `src/data/social.ts`). */
export function linkBaseWhatsapp() {
  return (
    socialLinks.find((link) => link.platform === "whatsapp")?.href ??
    `https://wa.me/${contato.whatsapp}`
  );
}
