"use client";

import { Menu, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";

import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";

import brandLogoImg from "../../../public/images/logo_16-9.png";
import { CarrinhoLink } from "./CarrinhoLink";
import { FavoritosLink } from "./FavoritosLink";
import { SamePageScrollLink } from "./SamePageScrollLink";

type MobileHeaderProps = {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  isMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  searchButtonRef?: RefObject<HTMLButtonElement | null>;
  className?: string;
};

const actionClassName = cn(
  "header-mobile-action",
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
  "text-[#000000] transition-[background-color,transform] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100",
  "hover:bg-black/5",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000]",
);

/**
 * Barra mobile: menu + busca à esquerda, logo centralizada na viewport,
 * favoritos/conta/sacola à direita. Apenas abaixo do breakpoint `lg`
 * (mesmo breakpoint do header desktop atual).
 */
export function MobileHeader({
  onOpenMenu,
  onOpenSearch,
  isMenuOpen,
  menuButtonRef,
  searchButtonRef,
  className,
}: MobileHeaderProps) {
  return (
    <div
      className={cn(
        "header-mobile-bar relative flex min-h-14 w-full items-center justify-between",
        "px-2 sm:px-3",
        className,
      )}
    >
      {/* Esquerda: menu + busca */}
      <div className="header-mobile-cluster relative z-[1] flex items-center">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-controls="mobile-sidebar"
          aria-expanded={isMenuOpen}
          onClick={onOpenMenu}
          className={actionClassName}
        >
          <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>

        <button
          ref={searchButtonRef}
          type="button"
          aria-label="Buscar no site"
          aria-haspopup="dialog"
          onClick={onOpenSearch}
          className={actionClassName}
        >
          <Search aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Centro: logo Essence — centralizada na viewport, independente dos lados */}
      <SamePageScrollLink
        href={routes.home}
        aria-label="Essence — ir para o início"
        className="header-mobile-logo absolute left-1/2 z-[2] inline-flex min-h-11 min-w-11 -translate-x-1/2 items-center justify-center rounded-lg transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        <Image
          src={brandLogoImg}
          alt="Essence"
          className="h-14 w-auto object-contain"
          priority
        />
      </SamePageScrollLink>

      {/* Direita: favoritos, conta e sacola */}
      <div className="header-mobile-cluster relative z-[1] flex items-center">
        <FavoritosLink className={actionClassName} />

        <Link
          href={routes.login}
          aria-label="Abrir minha conta"
          className={actionClassName}
        >
          <User aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </Link>

        <CarrinhoLink className={actionClassName} />
      </div>
    </div>
  );
}
