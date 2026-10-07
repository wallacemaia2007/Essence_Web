import { ImagePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FavoritoButton } from "@/components/common/favorito-button";
import type { ProdutoVitrine } from "@/data/vitrine";
import { caminhoDoProduto } from "@/lib/produto";

type ProdutoColecaoCardProps = {
  produto: ProdutoVitrine;
  priority?: boolean;
  hrefColecao?: string;
};

function formatarPreco(preco: number | null | undefined) {
  if (preco == null) {
    return "Preço a cadastrar";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

export function ProdutoColecaoCard({
  produto,
  priority = false,
  hrefColecao,
}: ProdutoColecaoCardProps) {
  const selo = (
    <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[0.58rem] tracking-[0.17em] text-[#51483f] uppercase">
      {produto.colecao}
    </span>
  );

  return (
    <article className="group relative min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#f5f5f5]">
        {produto.imagem ? (
          <>
            <Image
              src={produto.imagem}
              alt={produto.alt}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              quality={80}
              loading={priority ? "eager" : "lazy"}
              className="!rounded-none object-cover !shadow-none transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
            />
            {produto.imagemHover ? (
              <Image
                src={produto.imagemHover}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                quality={80}
                loading="lazy"
                className="!rounded-none object-cover opacity-0 !shadow-none transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
              />
            ) : null}
          </>
        ) : (
          <div
            role="img"
            aria-label={`Foto pendente: ${produto.alt}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#ffffff,#f1f1ef)] text-[#74685f]"
          >
            <ImagePlus
              className="size-9 opacity-70"
              aria-hidden="true"
              strokeWidth={1.2}
            />
            <span className="px-3 text-center text-[0.65rem] tracking-[0.2em] uppercase">
              Adicionar foto da peça
            </span>
          </div>
        )}

        {hrefColecao ? (
          <Link
            href={hrefColecao}
            aria-label={`Ver coleção ${produto.colecao}`}
            className="absolute top-3 left-3 z-10 bg-white/90 px-2.5 py-1 text-[0.58rem] tracking-[0.17em] text-[#51483f] uppercase transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {produto.colecao}
          </Link>
        ) : (
          selo
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-left text-sm leading-5 text-[#231f1b] sm:text-base">
            {/* Link "esticado": o ::after cobre o card inteiro e abre a peça. */}
            <Link
              href={caminhoDoProduto(produto.id)}
              className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              {produto.nome}
            </Link>
          </h3>
          <p className="mt-1 text-left text-xs text-[#51483f] sm:text-sm">
            {formatarPreco(produto.preco)}
          </p>
        </div>

        <FavoritoButton produto={produto} className="relative z-10" />
      </div>
    </article>
  );
}
