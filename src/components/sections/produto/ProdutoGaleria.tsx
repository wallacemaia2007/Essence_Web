"use client";

import { ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, useState } from "react";

import type { FotoProduto } from "@/data/produto-detalhes";
import { cn } from "@/lib/utils";

type ProdutoGaleriaProps = {
  nome: string;
  fotos: readonly FotoProduto[];
};

const botaoSetaClasse =
  "absolute top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/85 text-[#231f1b] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none";

/**
 * Galeria da peça: foto principal grande e miniaturas (coluna à esquerda no
 * desktop, fileira abaixo no celular). Sem fotos, mostra o espaço reservado.
 */
export function ProdutoGaleria({ fotos, nome }: ProdutoGaleriaProps) {
  const [indice, setIndice] = useState(0);
  const total = fotos.length;

  if (total === 0) {
    return (
      <div
        role="img"
        aria-label={`Foto pendente: ${nome}`}
        className="flex aspect-[2/3] flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#ffffff,#f1f1ef)] text-[#74685f]"
      >
        <ImagePlus
          className="size-10 opacity-70"
          aria-hidden="true"
          strokeWidth={1.2}
        />
        <span className="px-3 text-center text-[0.65rem] tracking-[0.2em] uppercase">
          Adicionar foto da peça
        </span>
      </div>
    );
  }

  const atual = fotos[indice] ?? fotos[0];

  function ir(passo: number) {
    setIndice((anterior) => (anterior + passo + total) % total);
  }

  function aoPressionarTecla(evento: KeyboardEvent<HTMLDivElement>) {
    if (total < 2) {
      return;
    }

    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      ir(-1);
    } else if (evento.key === "ArrowRight") {
      evento.preventDefault();
      ir(1);
    }
  }

  return (
    <div
      role="group"
      aria-label={`Fotos de ${nome}`}
      onKeyDown={aoPressionarTecla}
      className="flex flex-col gap-3 lg:relative lg:block"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[#f5f5f5] lg:ml-[5.75rem]">
        <Image
          key={atual.src}
          src={atual.src}
          alt={atual.alt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          quality={85}
          loading="eager"
          fetchPriority={indice === 0 ? "high" : "auto"}
          className="!rounded-none object-cover !shadow-none"
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => ir(-1)}
              className={cn(botaoSetaClasse, "left-3")}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => ir(1)}
              className={cn(botaoSetaClasse, "right-3")}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex gap-2 overflow-x-auto lg:absolute lg:inset-y-0 lg:left-0 lg:w-20 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto">
          {fotos.map((foto, posicao) => {
            const ativa = posicao === indice;

            return (
              <button
                key={foto.src}
                type="button"
                aria-label={`Ver foto ${posicao + 1} de ${total}`}
                aria-current={ativa ? "true" : undefined}
                onClick={() => setIndice(posicao)}
                className={cn(
                  "relative aspect-[2/3] w-16 shrink-0 cursor-pointer overflow-hidden bg-[#f5f5f5] outline-offset-2 transition-opacity focus-visible:outline-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none lg:w-full",
                  ativa
                    ? "outline-2 outline-[#231f1b]"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={foto.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="80px"
                  quality={70}
                  loading="lazy"
                  className="!rounded-none object-cover !shadow-none"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        Foto {indice + 1} de {total}
      </p>
    </div>
  );
}
