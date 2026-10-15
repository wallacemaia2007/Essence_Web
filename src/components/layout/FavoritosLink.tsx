"use client";

import { Heart } from "lucide-react";

import { routes } from "@/constants/routes";
import { useFavoritos } from "@/hooks/useFavoritos";
import { cn } from "@/lib/utils";

import { SamePageScrollLink } from "./SamePageScrollLink";

type FavoritosLinkProps = {
  className?: string;
};

/** Ícone de coração do header, com a contagem de peças favoritas. */
export function FavoritosLink({ className }: FavoritosLinkProps) {
  const { total, hidratado } = useFavoritos();
  const temFavoritos = hidratado && total > 0;

  return (
    <SamePageScrollLink
      href={routes.favoritos}
      aria-label="Favoritos"
      title="Favoritos"
      className={cn("relative", className)}
    >
      <Heart aria-hidden="true" className="size-5" strokeWidth={1.75} />
      <span className="sr-only">Favoritos</span>
      {temFavoritos ? (
        <span
          aria-hidden="true"
          className="absolute top-1 right-0.5 h-4 min-w-4 rounded-full bg-[#000000] px-1 text-center text-[0.6rem] leading-4 font-semibold text-white"
        >
          {total > 99 ? "99+" : total}
        </span>
      ) : null}
    </SamePageScrollLink>
  );
}
