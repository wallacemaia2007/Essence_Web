"use client";

import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, type TouchEvent, useRef, useState } from "react";

import type { ProdutoCor } from "@/data/vitrine";
import { cn } from "@/lib/utils";

type ProdutoGaleriaProps = {
  nome: string;
  images: readonly string[];
  cores?: readonly ProdutoCor[];
};

const botaoSetaClasse =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/85 text-[#231f1b] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none";

export function ProdutoGaleria({
  nome,
  images,
  cores = [],
}: ProdutoGaleriaProps) {
  const [indice, setIndice] = useState(0);
  const [corSelecionada, setCorSelecionada] = useState<string | null>(
    cores[0]?.name ?? null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toqueInicial = useRef<{ x: number; y: number } | null>(null);
  const corAtiva = cores.find((cor) => cor.name === corSelecionada);
  const imagensAtivas =
    corAtiva?.images && corAtiva.images.length > 0 ? corAtiva.images : images;
  const total = imagensAtivas.length;
  const imagemAtual = imagensAtivas[indice] ?? imagensAtivas[0];

  function ir(passo: number) {
    if (total < 2) return;
    setIndice((anterior) => (anterior + passo + total) % total);
  }

  function selecionarCor(cor: ProdutoCor) {
    setCorSelecionada(cor.name);
    setIndice(0);
  }

  function aoPressionarTecla(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      ir(-1);
    } else if (evento.key === "ArrowRight") {
      evento.preventDefault();
      ir(1);
    }
  }

  function aoIniciarToque(evento: TouchEvent<HTMLDivElement>) {
    const toque = evento.touches[0];
    toqueInicial.current = toque
      ? { x: toque.clientX, y: toque.clientY }
      : null;
  }

  function aoFinalizarToque(evento: TouchEvent<HTMLDivElement>) {
    const inicio = toqueInicial.current;
    const toque = evento.changedTouches[0];
    toqueInicial.current = null;
    if (!inicio || !toque || total < 2) return;

    const dx = toque.clientX - inicio.x;
    const dy = toque.clientY - inicio.y;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    ir(dx > 0 ? -1 : 1);
  }

  return (
    <div
      role="group"
      aria-label={`Fotos de ${nome}`}
      onKeyDown={aoPressionarTecla}
      className="flex flex-col gap-3 lg:relative lg:block"
    >
      <div
        className="relative aspect-[2/3] touch-pan-y overflow-hidden bg-[#f5f5f5] lg:ml-[5.75rem]"
        onTouchStart={aoIniciarToque}
        onTouchEnd={aoFinalizarToque}
      >
        {imagemAtual ? (
          <button
            type="button"
            aria-label={`Ampliar foto ${indice + 1} de ${total}`}
            onClick={() => dialogRef.current?.showModal()}
            className="absolute inset-0 size-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#231f1b]"
          >
            <Image
              key={`${corAtiva?.name ?? "padrao"}-${imagemAtual}`}
              src={imagemAtual}
              alt={
                corAtiva
                  ? `${nome}, cor ${corAtiva.name}`
                  : `${nome}, foto ${indice + 1}`
              }
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              quality={85}
              loading="eager"
              fetchPriority={indice === 0 ? "high" : "auto"}
              className="!rounded-none object-cover !shadow-none"
            />
            <span className="sr-only">Toque para ampliar a imagem.</span>
          </button>
        ) : (
          <div
            role="img"
            aria-label={`Foto pendente: ${nome}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#ffffff,#f1f1ef)] text-[#74685f]"
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
        )}

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

      {total > 0 ? (
        <div className="flex gap-2 overflow-x-auto lg:absolute lg:inset-y-0 lg:left-0 lg:w-20 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto">
          {imagensAtivas.map((imagem, posicao) => {
            const ativa = posicao === indice;

            return (
              <button
                key={`${posicao}-${imagem}`}
                type="button"
                aria-label={`Ver foto ${posicao + 1} de ${total}`}
                aria-pressed={ativa}
                onClick={() => setIndice(posicao)}
                className={cn(
                  "relative aspect-[2/3] w-16 shrink-0 cursor-pointer overflow-hidden bg-[#f5f5f5] outline-offset-2 transition-opacity focus-visible:outline-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none lg:w-full",
                  ativa
                    ? "outline-2 outline-[#231f1b]"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={imagem}
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

      {cores.length > 0 ? (
        <fieldset className="mt-2 border-0 p-0 lg:ml-[5.75rem]">
          <legend className="text-xs text-[#74685f]">
            Cor:{" "}
            <span className="font-medium text-[#231f1b]">
              {corAtiva?.name ?? "Selecione"}
            </span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {cores.map((cor) => {
              const ativa = cor.name === corSelecionada;
              return (
                <button
                  key={cor.name}
                  type="button"
                  aria-label={`Selecionar cor ${cor.name}`}
                  aria-pressed={ativa}
                  title={cor.name}
                  onClick={() => selecionarCor(cor)}
                  className={cn(
                    "size-8 rounded-full border border-[#d8d1ca] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#231f1b]",
                    ativa && "ring-2 ring-[#231f1b] ring-offset-2",
                  )}
                  style={{ backgroundColor: cor.hex }}
                />
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {total > 0
          ? `Foto ${indice + 1} de ${total}`
          : `Foto pendente: ${nome}`}
      </p>

      {imagemAtual ? (
        <dialog
          ref={dialogRef}
          aria-label={`Foto ampliada de ${nome}`}
          onClick={(evento) => {
            if (evento.target === evento.currentTarget)
              evento.currentTarget.close();
          }}
          className="m-auto max-h-[94dvh] w-[min(96vw,80rem)] max-w-none border-0 bg-[#111111] p-0 text-white shadow-2xl backdrop:bg-black/80"
        >
          <div className="relative h-[88dvh] max-h-[88dvh] w-full p-4 sm:p-6">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fechar imagem ampliada"
              className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center bg-white text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <div className="relative h-full w-full">
              <Image
                src={imagemAtual}
                alt={
                  corAtiva
                    ? `${nome}, cor ${corAtiva.name}`
                    : `${nome}, foto ${indice + 1}`
                }
                fill
                sizes="96vw"
                quality={90}
                className="!rounded-none object-contain !shadow-none"
              />
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
