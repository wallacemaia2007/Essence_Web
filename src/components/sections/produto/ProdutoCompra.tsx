"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import type { TamanhoProduto } from "@/data/produto-detalhes";
import { type SizeGuideMeasurement, sizeGuideRows } from "@/data/size-guide";
import { useCarrinho } from "@/hooks/useCarrinho";
import { cn } from "@/lib/utils";
import {
  mensagemDeInteresse,
  mensagemDeReposicao,
  montarLinkWhatsapp,
} from "@/lib/whatsapp";

type ProdutoCompraProps = {
  produtoId: string;
  nome: string;
  referencia: string;
  tamanhos: readonly TamanhoProduto[];
  precoFormatado: string;
  /** Link base do WhatsApp da loja (a mensagem é acrescentada aqui). */
  whatsappBase: string;
};

function formatarMedida(valor: SizeGuideMeasurement) {
  return valor === "PLACEHOLDER" ? "A confirmar" : `${valor} cm`;
}

/**
 * Seletor de tamanho e ações de compra da página do produto.
 */
export function ProdutoCompra({
  produtoId,
  nome,
  referencia,
  tamanhos,
  precoFormatado,
  whatsappBase,
}: ProdutoCompraProps) {
  const idErro = useId();
  const grupoRef = useRef<HTMLFieldSetElement>(null);
  const guiaRef = useRef<HTMLDialogElement>(null);
  const { adicionar } = useCarrinho();
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [mostrarErro, setMostrarErro] = useState(false);

  const exigeTamanho = tamanhos.some((item) => item.disponivel);
  const href = montarLinkWhatsapp(
    whatsappBase,
    mensagemDeInteresse({ nome, referencia, tamanho }),
  );
  const tamanhosIndisponiveis = tamanhos.filter((item) => !item.disponivel);

  function aoClicarEmComprar(evento: React.MouseEvent<HTMLAnchorElement>) {
    if (exigeTamanho && tamanho === null) {
      evento.preventDefault();
      setMostrarErro(true);
      grupoRef.current
        ?.querySelector<HTMLInputElement>("input:not(:disabled)")
        ?.focus();
    }
  }

  function aoAdicionarAoCarrinho() {
    if (!exigeTamanho) {
      toast.error("Esta peça está temporariamente indisponível.");
      return;
    }

    if (tamanho === null) {
      setMostrarErro(true);
      grupoRef.current
        ?.querySelector<HTMLInputElement>("input:not(:disabled)")
        ?.focus();
      return;
    }

    adicionar(produtoId, tamanho);
    toast.success(`${nome} adicionado à sacola`, {
      description: `Tamanho ${tamanho}`,
    });
  }

  function abrirGuia() {
    guiaRef.current?.showModal();
  }

  return (
    <div>
      <fieldset
        ref={grupoRef}
        aria-describedby={mostrarErro ? idErro : undefined}
        className="min-w-0 border-0 p-0"
      >
        <legend className="text-sm tracking-wide text-[#231f1b]">
          Tamanho
        </legend>

        <div className="mt-3 flex flex-wrap gap-2">
          {tamanhos.map((item) => (
            <label
              key={item.rotulo}
              className={cn(
                "relative",
                item.disponivel ? "cursor-pointer" : "cursor-not-allowed",
              )}
            >
              <input
                type="radio"
                name="tamanho"
                value={item.rotulo}
                disabled={!item.disponivel}
                checked={tamanho === item.rotulo}
                onChange={() => {
                  setTamanho(item.rotulo);
                  setMostrarErro(false);
                }}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-10 min-w-12 items-center justify-center border px-3 text-sm transition-colors motion-reduce:transition-none",
                  "border-[#231f1b] text-[#231f1b] hover:bg-[#f5f5f5]",
                  "peer-checked:bg-[#231f1b] peer-checked:text-white",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#231f1b]",
                  "peer-disabled:border-[#e5e1dd] peer-disabled:bg-transparent peer-disabled:text-[#b3aba4] peer-disabled:line-through peer-disabled:hover:bg-transparent",
                )}
              >
                {item.rotulo}
                {item.disponivel ? null : (
                  <span className="sr-only"> (indisponível)</span>
                )}
              </span>
            </label>
          ))}
        </div>
        {tamanhosIndisponiveis.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tamanhosIndisponiveis.map((item) => (
              <a
                key={item.rotulo}
                href={montarLinkWhatsapp(
                  whatsappBase,
                  mensagemDeReposicao({
                    nome,
                    referencia,
                    tamanho: item.rotulo,
                  }),
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Avise-me quando chegar no tamanho ${item.rotulo}`}
                className="inline-flex min-h-10 items-center border border-[#d8d1ca] px-3 text-xs font-medium text-[#51483f] underline underline-offset-4 transition-colors hover:border-[#231f1b] hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
              >
                Avise-me quando chegar · {item.rotulo}
              </a>
            ))}
          </div>
        ) : null}
      </fieldset>

      <div className="mt-2 flex flex-wrap justify-end gap-x-4">
        <button
          type="button"
          onClick={abrirGuia}
          className="inline-flex min-h-8 items-center text-xs font-medium text-[#74685f] underline decoration-[#bdb5ad] underline-offset-4 transition-colors hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
        >
          Guia de tamanhos
        </button>
        <Link
          href={routes.trocasDevolucoes}
          className="inline-flex min-h-8 items-center text-xs font-medium text-[#74685f] underline decoration-[#bdb5ad] underline-offset-4 transition-colors hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
        >
          Trocas e devoluções
        </Link>
        <Link
          href={routes.entregaFrete}
          className="inline-flex min-h-8 items-center text-xs font-medium text-[#74685f] underline decoration-[#bdb5ad] underline-offset-4 transition-colors hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
        >
          Entrega e frete
        </Link>
      </div>

      {mostrarErro ? (
        <p id={idErro} role="alert" className="mt-3 text-sm text-[#b42318]">
          Escolha um tamanho para continuar.
        </p>
      ) : null}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={aoClicarEmComprar}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-black px-4 text-xs font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none"
      >
        <FaWhatsapp className="size-4" aria-hidden="true" />
        {exigeTamanho ? "Comprar pelo WhatsApp" : "Consultar disponibilidade"}
      </a>

      <button
        type="button"
        onClick={aoAdicionarAoCarrinho}
        disabled={!exigeTamanho}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 border border-black px-4 text-xs font-semibold tracking-[0.18em] text-[#231f1b] uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:border-[#cfc6bc] disabled:text-[#897f75] disabled:hover:bg-transparent disabled:hover:text-[#897f75] motion-reduce:transition-none"
      >
        <ShoppingBag className="size-4" aria-hidden="true" />
        Adicionar ao carrinho
      </button>

      <dialog
        ref={guiaRef}
        aria-labelledby={`${idErro}-guia-title`}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget)
            evento.currentTarget.close();
        }}
        className="m-auto max-h-[88dvh] w-[min(96vw,54rem)] max-w-none overflow-y-auto border border-[#e5e1dd] bg-white p-0 text-[#231f1b] shadow-2xl backdrop:bg-black/60"
      >
        <div className="flex items-start justify-between gap-6 border-b border-[#e5e1dd] p-5 sm:p-7">
          <div>
            <p className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] text-[#74685f] uppercase">
              Guia de tamanhos
            </p>
            <h2
              id={`${idErro}-guia-title`}
              className="font-heading mt-2 mb-0 text-2xl tracking-wide uppercase sm:text-3xl"
            >
              Encontre seu tamanho
            </h2>
          </div>
          <button
            type="button"
            onClick={() => guiaRef.current?.close()}
            aria-label="Fechar guia de tamanhos"
            className="inline-flex size-10 shrink-0 items-center justify-center border border-[#d8d1ca] text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
          >
            ×
          </button>
        </div>
        <div className="p-5 sm:p-7">
          <p className="mb-4 text-sm leading-6 text-[#655e57]">
            Compare busto, cintura e quadril. As medidas ainda precisam ser
            confirmadas pela loja.
          </p>
          <div className="overflow-x-auto border border-[#e5e1dd]">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Medidas do guia de tamanhos em centímetros
              </caption>
              <thead className="bg-[#f7f7f7] text-xs tracking-[0.12em] text-[#655e57] uppercase">
                <tr>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                    Tamanho
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                    Busto
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                    Cintura
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                    Quadril
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizeGuideRows.map((linha) => (
                  <tr key={linha.tamanho} className="border-t border-[#e5e1dd]">
                    <th scope="row" className="px-3 py-3 font-medium sm:px-4">
                      {linha.tamanho}
                    </th>
                    <td className="px-3 py-3 sm:px-4">
                      {formatarMedida(linha.busto)}
                    </td>
                    <td className="px-3 py-3 sm:px-4">
                      {formatarMedida(linha.cintura)}
                    </td>
                    <td className="px-3 py-3 sm:px-4">
                      {formatarMedida(linha.quadril)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#74685f]">
            As medidas podem variar conforme a modelagem da peça.
          </p>
        </div>
      </dialog>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e5e1dd] bg-white/95 p-3 [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <p className="m-0 min-w-0 flex-1 truncate text-sm font-semibold text-[#231f1b]">
            {precoFormatado}
          </p>
          {exigeTamanho ? (
            <button
              type="button"
              onClick={aoAdicionarAoCarrinho}
              aria-label={`Adicionar ${nome} à sacola`}
              className="min-h-11 flex-1 bg-[#231f1b] px-4 text-xs font-semibold tracking-[0.12em] text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Adicionar à sacola
            </button>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 flex-1 items-center justify-center bg-[#231f1b] px-4 text-xs font-semibold tracking-[0.12em] text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Consultar disponibilidade
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
