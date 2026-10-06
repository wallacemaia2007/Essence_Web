"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import type { ProdutoVitrine } from "@/data/vitrine";
import { useFavoritos } from "@/hooks/useFavoritos";
import { cn } from "@/lib/utils";

type FavoritoButtonProps = {
  produto: Pick<ProdutoVitrine, "id" | "nome">;
  className?: string;
};

export function FavoritoButton({ produto, className }: FavoritoButtonProps) {
  const router = useRouter();
  const { ids, alternar } = useFavoritos();
  const favorita = ids.includes(produto.id);

  function aoClicar() {
    const adicionada = alternar(produto.id);

    if (adicionada) {
      toast.success(`${produto.nome} foi para seus favoritos`, {
        action: {
          label: "Ver favoritos",
          onClick: () => router.push(routes.favoritos),
        },
      });
    }
  }

  return (
    <button
      type="button"
      aria-pressed={favorita}
      aria-label={
        favorita
          ? `Remover ${produto.nome} dos favoritos`
          : `Adicionar ${produto.nome} aos favoritos`
      }
      onClick={aoClicar}
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-[#51483f] transition duration-200 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-[1.15rem] transition-colors duration-200 motion-reduce:transition-none",
          favorita && "fill-[#231f1b] text-[#231f1b]",
        )}
        strokeWidth={1.35}
        aria-hidden="true"
      />
    </button>
  );
}
