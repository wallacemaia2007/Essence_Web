"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import type { TamanhoProduto } from "@/data/produto-detalhes";
import { useCarrinho } from "@/hooks/useCarrinho";
import { cn } from "@/lib/utils";
import { mensagemDeInteresse, montarLinkWhatsapp } from "@/lib/whatsapp";

type ProdutoCompraProps = {
  produtoId: string;
  nome: string;
  referencia: string;
  tamanhos: readonly TamanhoProduto[];
  /** Link base do WhatsApp da loja (a mensagem é acrescentada aqui). */
  whatsappBase: string;
};

/**
 * Seletor de tamanho e ações de compra da página do produto.
 */
export function ProdutoCompra({
  produtoId,
  nome,
  referencia,
  tamanhos,
  whatsappBase,
}: ProdutoCompraProps) {
  const idErro = useId();
  const grupoRef = useRef<HTMLFieldSetElement>(null);
  const { adicionar } = useCarrinho();
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [mostrarErro, setMostrarErro] = useState(false);

  const exigeTamanho = tamanhos.some((item) => item.disponivel);
  const href = montarLinkWhatsapp(
    whatsappBase,
    mensagemDeInteresse({ nome, referencia, tamanho }),
  );

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
      </fieldset>

      <div className="mt-2 flex justify-end">
        <Link
          href={routes.guiaTamanhos}
          className="inline-flex min-h-8 items-center text-xs font-medium text-[#74685f] underline decoration-[#bdb5ad] underline-offset-4 transition-colors hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
        >
          Guia de tamanhos
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
    </div>
  );
}
