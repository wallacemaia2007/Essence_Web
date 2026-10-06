import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ColecaoDetalhe } from "@/components/sections/colecao/ColecaoDetalhe";
import { routes } from "@/constants/routes";
import { conjuntosData } from "@/data/conjuntos";

type ColecaoPageProps = {
  params: Promise<{ slug: string }>;
};

function encontrarColecao(slug: string) {
  return conjuntosData.itens.find((conjunto) => conjunto.id === slug);
}

export function generateStaticParams() {
  return conjuntosData.itens.map((conjunto) => ({ slug: conjunto.id }));
}

export async function generateMetadata({
  params,
}: ColecaoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const colecao = encontrarColecao(slug);

  if (!colecao) {
    return {
      title: "Coleção não encontrada",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${routes.colecao}/${colecao.id}`;
  const description =
    colecao.descricao ??
    `Explore as peças da coleção ${colecao.titulo} da Essence.`;

  return {
    title: colecao.titulo,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${colecao.titulo} | Essence`,
      description,
      url: canonical,
      type: "website",
      images: [{ url: colecao.image, alt: colecao.alt }],
    },
  };
}

export default async function ColecaoPage({ params }: ColecaoPageProps) {
  const { slug } = await params;
  const colecao = encontrarColecao(slug);

  if (!colecao) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col bg-white">
      <ColecaoDetalhe colecao={colecao} />
    </main>
  );
}
