"use client";

import { MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/common";
import { anchors, routes } from "@/constants/routes";
import { useHasPassedHero } from "@/hooks/useHasPassedHero";
import { useHeaderTopHold } from "@/hooks/useHeaderTopHold";
import { useScrollDirection } from "@/hooks/useScrollDirection";

import { CarrinhoLink } from "./CarrinhoLink";
import { type DesktopMegaMenuId, DesktopMegaNav } from "./DesktopMegaNav";
import { FavoritosLink } from "./FavoritosLink";
import { MobileHeader } from "./MobileHeader";
import { MobileSidebar } from "./MobileSidebar";
import { SamePageScrollLink } from "./SamePageScrollLink";
import { SiteSearchDialog } from "./SiteSearchDialog";

const HEADER_HEIGHT = 64;

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] =
    useState<DesktopMegaMenuId | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { hasMeasured, hasPassedHero } = useHasPassedHero(
    HEADER_HEIGHT,
    pathname,
  );
  const { direction, isAtTop } = useScrollDirection({
    threshold: 9,
    topOffset: 80,
  });
  // No topo do hero o header fica recolhido; ao descer um pouco ele aparece
  // e permanece visível enquanto o hero ocupa o topo. Ao voltar ao topo ele
  // não some na hora: espera 2 s e só então recolhe. Fora do hero vale o
  // padrão: some ao descer e reaparece ao subir. Ele permanece aberto
  // enquanto um painel está ativo.
  const isAtHeroTop = !hasPassedHero && isAtTop;
  const isPanelOpen = isSidebarOpen || isSearchOpen || activeMegaMenu !== null;
  const shouldHide =
    (isAtHeroTop || (hasPassedHero && !isAtTop && direction !== "up")) &&
    !isPanelOpen;
  const isHoldingAtTop = useHeaderTopHold({
    isAtTop: isAtHeroTop,
    isVisible: !shouldHide,
    hasMeasured,
  });
  const isHidden = shouldHide && !isHoldingAtTop;
  const headerTheme = hasPassedHero ? "default" : "intro";

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Gesto de borda ESQUERDA: arrastar para a direita abre a sidebar.
  const onEdgeTouchStart = useCallback((e: TouchEvent) => {
    const x = e.touches[0].clientX;
    if (x <= 30) {
      touchStart.current = { x, y: e.touches[0].clientY };
    }
  }, []);

  const onEdgeTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 50) return;

    setIsSidebarOpen(true);
  }, []);

  useEffect(() => {
    if (isSidebarOpen || isSearchOpen) return;

    document.addEventListener("touchstart", onEdgeTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", onEdgeTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onEdgeTouchStart);
      document.removeEventListener("touchend", onEdgeTouchEnd);
    };
  }, [isSidebarOpen, isSearchOpen, onEdgeTouchStart, onEdgeTouchEnd]);

  const openSidebar = useCallback(() => {
    setIsSearchOpen(false);
    setActiveMegaMenu(null);
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setIsSidebarOpen(false);
    setActiveMegaMenu(null);
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <>
      <header
        data-header-theme={headerTheme}
        data-variant={hasPassedHero ? "site" : "intro"}
        data-state={isHidden ? "hidden" : "visible"}
        data-hero-state={hasMeasured ? "measured" : "pending"}
        inert={isHidden && !isSidebarOpen && !isSearchOpen ? true : undefined}
        className="header-glass fixed inset-x-0 top-0 z-[90]"
      >
        {/* Desktop: navegação em cápsula de vidro fosco */}
        <Container className="header-desktop-shell hidden min-h-16 items-center justify-between gap-2 lg:flex">
          <SamePageScrollLink
            href={routes.home}
            aria-label="Essence Passos — ir para o início"
            className="font-heading focus-visible:ring-ring/50 flex items-center gap-2 rounded-full text-base leading-none tracking-wide text-[#000000] uppercase transition-transform duration-300 focus-visible:ring-3 focus-visible:outline-none active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            Essence Passos
          </SamePageScrollLink>

          <DesktopMegaNav
            activeMenu={activeMegaMenu}
            onActiveMenuChange={setActiveMegaMenu}
            className="hidden items-center gap-0.5 lg:flex"
            linkClassName="text-[0.68rem] font-semibold tracking-[0.12em] text-[#000000] uppercase hover:text-[#000000] aria-[current=page]:text-[#000000]"
          />

          <div className="flex items-center gap-2">
            <FavoritosLink className="inline-flex size-10 items-center justify-center rounded-full text-[#000000] transition-colors duration-300 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100" />
            <CarrinhoLink className="inline-flex size-10 items-center justify-center rounded-full text-[#000000] transition-colors duration-300 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100" />
            <Link
              href={routes.login}
              aria-label="Entrar na conta"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-3 text-xs font-semibold tracking-wide text-[#000000] transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <UserRound aria-hidden="true" className="size-4" />
              Entrar
            </Link>
            <SamePageScrollLink
              href={anchors.localizacao}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#000000] px-4 text-xs font-semibold tracking-wide text-white transition duration-300 hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <MapPin aria-hidden="true" className="size-3.5" />
              Visite a loja
            </SamePageScrollLink>
          </div>
        </Container>

        {/* Mobile: cápsula translúcida com logo centralizada */}
        <div className="lg:hidden">
          <MobileHeader
            onOpenMenu={openSidebar}
            onOpenSearch={openSearch}
            isMenuOpen={isSidebarOpen}
            menuButtonRef={menuButtonRef}
            searchButtonRef={searchButtonRef}
          />
        </div>
      </header>

      <div id="mobile-sidebar">
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          returnFocusRef={menuButtonRef}
        />
      </div>

      <SiteSearchDialog
        key={isSearchOpen ? "site-search-open" : "site-search-closed"}
        isOpen={isSearchOpen}
        onClose={closeSearch}
        returnFocusRef={searchButtonRef}
      />
    </>
  );
}
