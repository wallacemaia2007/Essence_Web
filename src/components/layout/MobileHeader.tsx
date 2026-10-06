"use client";

import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import type { RefObject } from "react";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";

import brandLogoImg from "../../../public/images/brand/logo.png";
import { SamePageScrollLink } from "./SamePageScrollLink";

type MobileHeaderProps = {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  isMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  searchButtonRef?: RefObject<HTMLButtonElement | null>;
  className?: string;
};

/**
 * Ações do header mobile sem rota pronta no projeto.
 * Ponto de integração: quando a função existir, trocar o botão por
 * `SamePageScrollLink`/`Link` apontando para a rota real em
 * `src/constants/routes.ts` (não usar href "#").
 */
type PendingHeaderAction = "favoritos" | "conta" | "sacola";

const PENDING_ACTION_COPY: Record<
  PendingHeaderAction,
  { title: string; integration: string }
> = {
  favoritos: {
    title: "Favoritos ainda não estão disponíveis nesta versão.",
    integration:
      "Integração pendente: criar rota /favoritos e estado global de favoritos.",
  },
  conta: {
    title: "Área da conta ainda não está disponível nesta versão.",
    integration:
      "Integração pendente: criar rota /conta (login e perfil).",
  },
  sacola: {
    title: "Sacola ainda não está disponível nesta versão.",
    integration:
      "Integração pendente: criar rota /sacola e estado de carrinho.",
  },
};

function notifyPendingIntegration(action: PendingHeaderAction) {
  const copy = PENDING_ACTION_COPY[action];

  toast.info(copy.title, { description: copy.integration });
}

const actionClassName = cn(
  "header-mobile-action",
  "inline-flex size-11 shrink-0 items-center justify-center rounded-lg",
  "text-[#231f1b] transition-colors",
  "hover:bg-[rgb(35_31_27_/_0.05)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]",
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
        className="header-mobile-logo absolute left-1/2 z-[2] inline-flex min-h-11 min-w-11 -translate-x-1/2 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
      >
        <Image
          src={brandLogoImg}
          alt="Essence"
          className="h-8 w-8 object-contain sm:h-9 sm:w-9"
          priority
        />
      </SamePageScrollLink>

      {/* Direita: favoritos, conta e sacola */}
      <div className="header-mobile-cluster relative z-[1] flex items-center">
        <button
          type="button"
          aria-label="Abrir favoritos"
          data-pending-integration="favoritos"
          onClick={() => notifyPendingIntegration("favoritos")}
          className={actionClassName}
        >
          <Heart aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          aria-label="Abrir minha conta"
          data-pending-integration="conta"
          onClick={() => notifyPendingIntegration("conta")}
          className={actionClassName}
        >
          <User aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          aria-label="Abrir sacola"
          data-pending-integration="sacola"
          onClick={() => notifyPendingIntegration("sacola")}
          className={actionClassName}
        >
          <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
