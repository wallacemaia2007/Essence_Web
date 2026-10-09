import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { ProdutoDetalhe } from "@/components/sections/produto/ProdutoDetalhe";
import { produtosVitrine } from "@/data/vitrine";
import {
  caminhoDoProduto,
  detalharProduto,
  encontrarProduto,
  formatarPreco,
} from "@/lib/produto";
import { absoluteUrl } from "@/lib/seo";

type ProdutoPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return produtosVitrine.map((produto) => ({ id: produto.id }));
}

export async function generateMetadata({
  params,
}: ProdutoPageProps): Promise<Metadata> {
  const { id } = await params;
  const produto = encontrarProduto(id);

  if (!produto) {
    return {
      title: "Peça não encontrada",
      robots: { index: false, follow: false },
    };
  }

  const { fotos } = detalharProduto(produto);
  const canonical = caminhoDoProduto(produto.id);
  const description = `${produto.nome}, da coleção ${produto.colecao} da Essence. ${formatarPreco(produto.preco)}.`;

  return {
    title: produto.nome,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${produto.nome} | Essence`,
      description,
      url: canonical,
      type: "website",
      images: fotos[0] ? [{ url: fotos[0].src, alt: fotos[0].alt }] : undefined,
    },
  };
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { id } = await params;
  const produto = encontrarProduto(id);

  if (!produto) {
    notFound();
  }

  const detalhe = detalharProduto(produto);
  const { fotos, referencia, tamanhos } = detalhe;

  // Dados estruturados só quando há foto e preço: o Google exige os dois.
  const jsonLd =
    fotos.length > 0 && produto.preco != null
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: produto.nome,
          sku: referencia,
          image: fotos.map((foto) => absoluteUrl(foto.src)),
          brand: { "@type": "Brand", name: "Essence" },
          category: produto.colecao,
          offers: {
            "@type": "Offer",
            url: absoluteUrl(caminhoDoProduto(produto.id)),
            priceCurrency: "BRL",
            price: produto.preco.toFixed(2),
            availability: tamanhos.some((tamanho) => tamanho.disponivel)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }
      : null;

  return (
    <main className="flex flex-1 flex-col bg-white">
      <ProdutoDetalhe detalhe={detalhe} />
      {jsonLd ? (
        <Script
          id="product-structured-data"
          type="application/ld+json"
          // `<` escapado para que um texto nunca consiga fechar a tag <script>.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
    </main>
  );
}
