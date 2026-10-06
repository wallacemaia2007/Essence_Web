"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ProdutoVitrine } from "@/data/vitrine";

import { ProdutoColecaoCard } from "./ProdutoColecaoCard";

const ITENS_POR_PAGINA = 12;

type ColecaoProdutosPaginadosProps = {
  tituloColecao: string;
  produtosDestaque: readonly ProdutoVitrine[];
  produtosRestantes: readonly ProdutoVitrine[];
};

type PrateleiraProps = {
  id: string;
  eyebrow: string;
  titulo: string;
  descricao: string;
  produtos: readonly ProdutoVitrine[];
  mensagemVazia: string;
  className?: string;
};

function Prateleira({
  id,
  eyebrow,
  titulo,
  descricao,
  produtos,
  mensagemVazia,
  className,
}: PrateleiraProps) {
  return (
    <section aria-labelledby={`${id}-titulo`} className={className}>
      <div className="mb-7 max-w-2xl md:mb-9">
        <p className="text-xs font-semibold tracking-[0.24em] text-[#74685f] uppercase">
          {eyebrow}
        </p>
        <h2
          id={`${id}-titulo`}
          className="font-heading mt-3 text-2xl leading-tight tracking-wide text-[#231f1b] uppercase sm:text-3xl md:text-4xl"
        >
          {titulo}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#655e57] sm:text-base">
          {descricao}
        </p>
      </div>

      {produtos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
          {produtos.map((produto, index) => (
            <li key={produto.id} className="min-w-0 before:hidden">
              <ProdutoColecaoCard produto={produto} priority={index === 0} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-y border-[#e5e1dd] py-6 text-sm leading-6 text-[#655e57]">
          {mensagemVazia}
        </p>
      )}
    </section>
  );
}

export function ColecaoProdutosPaginados({
  tituloColecao,
  produtosDestaque,
  produtosRestantes,
}: ColecaoProdutosPaginadosProps) {
  const [paginaSolicitada, setPaginaSolicitada] = useState(1);
  const todosOsProdutos = [...produtosDestaque, ...produtosRestantes];
  const totalDeProdutos = todosOsProdutos.length;
  const totalDePaginas = Math.max(
    1,
    Math.ceil(totalDeProdutos / ITENS_POR_PAGINA),
  );
  const paginaAtual = Math.min(paginaSolicitada, totalDePaginas);
  const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const produtosDaPagina = todosOsProdutos.slice(
    indiceInicial,
    indiceInicial + ITENS_POR_PAGINA,
  );
  const destaquesDaPagina = produtosDaPagina.filter(
    (produto) => produto.destaqueColecao === true,
  );
  const restantesDaPagina = produtosDaPagina.filter(
    (produto) => produto.destaqueColecao !== true,
  );
  const indiceFinal = Math.min(
    indiceInicial + produtosDaPagina.length,
    totalDeProdutos,
  );

  return (
    <div id="colecao-produtos">
      {paginaAtual === 1 ? (
        <Prateleira
          id="destaques-colecao"
          eyebrow="Escolhas da Essence"
          titulo="Destaques da coleção"
          descricao={`Peças selecionadas de ${tituloColecao} para você conhecer primeiro.`}
          produtos={destaquesDaPagina}
          mensagemVazia="Os destaques desta coleção serão selecionados em breve."
          className="pb-12 md:pb-16"
        />
      ) : null}

      {paginaAtual === 1 || restantesDaPagina.length > 0 ? (
        <Prateleira
          id="pecas-colecao"
          eyebrow="Explore a seleção"
          titulo="Todas as peças da coleção"
          descricao={`Veja as outras roupas disponíveis em ${tituloColecao}.`}
          produtos={restantesDaPagina}
          mensagemVazia="As demais peças desta coleção serão adicionadas em breve."
          className={
            destaquesDaPagina.length > 0
              ? "border-t border-[#e5e1dd] pt-12 md:pt-16"
              : undefined
          }
        />
      ) : null}

      {totalDeProdutos > 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#e5e1dd] pt-6 sm:flex-row sm:justify-between">
          <p
            aria-live="polite"
            className="text-center text-xs text-[#655e57] sm:text-left"
          >
            Página {paginaAtual} de {totalDePaginas} · Exibindo{" "}
            {indiceInicial + 1}–{indiceFinal} de {totalDeProdutos} peças
          </p>

          <nav
            aria-label={`Paginação dos produtos da coleção ${tituloColecao}`}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              disabled={paginaAtual <= 1}
              onClick={() => setPaginaSolicitada(paginaAtual - 1)}
              aria-label="Ir para a página anterior"
              aria-controls="colecao-produtos"
              className="min-h-11 rounded-full border-[#ded9d3] px-4 text-[#231f1b]"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Anterior
            </Button>

            <div
              role="group"
              aria-label="Escolher página"
              className="flex gap-1"
            >
              {Array.from({ length: totalDePaginas }, (_, indice) => {
                const pagina = indice + 1;
                const paginaSelecionada = paginaAtual === pagina;

                return (
                  <Button
                    key={pagina}
                    type="button"
                    variant="outline"
                    onClick={() => setPaginaSolicitada(pagina)}
                    aria-label={`Ir para a página ${pagina}`}
                    aria-current={paginaSelecionada ? "page" : undefined}
                    aria-controls="colecao-produtos"
                    className={
                      paginaSelecionada
                        ? "min-h-11 min-w-11 rounded-full border-[#231f1b] bg-[#231f1b] px-3 text-white hover:bg-[#51483f] hover:text-white"
                        : "min-h-11 min-w-11 rounded-full border-[#ded9d3] px-3 text-[#231f1b]"
                    }
                  >
                    {pagina}
                  </Button>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={paginaAtual >= totalDePaginas}
              onClick={() => setPaginaSolicitada(paginaAtual + 1)}
              aria-label="Ir para a próxima página"
              aria-controls="colecao-produtos"
              className="min-h-11 rounded-full border-[#ded9d3] px-4 text-[#231f1b]"
            >
              Próxima
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
