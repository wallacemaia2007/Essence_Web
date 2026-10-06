"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { routes } from "@/constants/routes";
import { produtosVitrine,type ProdutoVitrine } from "@/data/vitrine";
import { useFavoritos } from "@/hooks/useFavoritos";
import { caminhoDaColecao } from "@/lib/colecao";

import { PaginacaoProdutos } from "../colecao/PaginacaoProdutos";
import { ProdutoColecaoCard } from "../colecao/ProdutoColecaoCard";

const ITENS_POR_PAGINA = 12;
const ID_LISTA = "favoritos-produtos";

const produtosPorId = new Map<string, ProdutoVitrine>(
  produtosVitrine.map((produto) => [produto.id, produto]),
);

export function FavoritosLista() {
  const { ids, hidratado } = useFavoritos();
  const [paginaSolicitada, setPaginaSolicitada] = useState(1);

  // Mais recentes primeiro: a última peça favoritada abre a lista.
  const produtos = useMemo(
    () =>
      [...ids]
        .reverse()
        .map((id) => produtosPorId.get(id))
        .filter((produto): produto is ProdutoVitrine => produto !== undefined),
    [ids],
  );

  if (!hidratado) {
    return (
      <div className="min-h-[24rem]" aria-busy="true">
        <p role="status" className="sr-only">
          Carregando seus favoritos…
        </p>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="flex flex-col items-center border-y border-[#e5e1dd] px-4 py-14 text-center md:py-20">
        <Heart
          className="size-10 text-[#74685f]"
          strokeWidth={1.2}
          aria-hidden="true"
        />
        <h2 className="font-heading mt-5 text-2xl leading-tight tracking-wide text-[#231f1b] uppercase sm:text-3xl">
          Nenhuma peça favorita ainda
        </h2>
        <p className="mt-3 max-w-md text-center text-sm leading-6 text-[#655e57] sm:text-base">
          Toque no coração de uma peça para guardá-la aqui. Se tirar o coração,
          ela sai da lista.
        </p>
        <Link
          href={routes.colecao}
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#000000] px-6 text-sm font-semibold text-white transition duration-300 hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          Explorar as peças
        </Link>
      </div>
    );
  }

  const totalDeProdutos = produtos.length;
  const totalDePaginas = Math.max(
    1,
    Math.ceil(totalDeProdutos / ITENS_POR_PAGINA),
  );
  // Se a última peça da última página sair, volta para a página anterior.
  const paginaAtual = Math.min(paginaSolicitada, totalDePaginas);
  const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const produtosDaPagina = produtos.slice(
    indiceInicial,
    indiceInicial + ITENS_POR_PAGINA,
  );
  const indiceFinal = Math.min(
    indiceInicial + produtosDaPagina.length,
    totalDeProdutos,
  );

  return (
    <div id={ID_LISTA}>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
        {produtosDaPagina.map((produto, index) => (
          <li key={produto.id} className="min-w-0 before:hidden">
            <ProdutoColecaoCard
              produto={produto}
              priority={index === 0}
              hrefColecao={caminhoDaColecao(produto.colecao)}
            />
          </li>
        ))}
      </ul>

      <PaginacaoProdutos
        paginaAtual={paginaAtual}
        totalDePaginas={totalDePaginas}
        indiceInicial={indiceInicial}
        indiceFinal={indiceFinal}
        totalDeProdutos={totalDeProdutos}
        aoMudarPagina={setPaginaSolicitada}
        controlaId={ID_LISTA}
        rotulo="Paginação dos produtos favoritos"
      />
    </div>
  );
}
