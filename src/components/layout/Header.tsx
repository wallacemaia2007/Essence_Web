"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/common";
import { anchors, routes } from "@/constants/routes";
import { useHasPassedHero } from "@/hooks/useHasPassedHero";
import { useScrollDirection } from "@/hooks/useScrollDirection";

import logoImg from "../../../public/images/logo.png";
import { MobileHeader } from "./MobileHeader";
import { MobileSidebar } from "./MobileSidebar";
import { NavLinks } from "./NavLinks";
import { SamePageScrollLink } from "./SamePageScrollLink";
import { SiteSearchDialog } from "./SiteSearchDialog";

const HEADER_HEIGHT = 64;

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
  // A cápsula só aparece quando a rolagem é para cima, fora do topo:
  // no topo da página (hero) e ao descer ela fica recolhida.
  // Ela permanece aberta enquanto um painel está ativo.
  const isHidden =
    (isAtTop || direction === "down") && !isSidebarOpen && !isSearchOpen;
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
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setIsSidebarOpen(false);
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
            className="font-heading focus-visible:ring-ring/50 flex items-center gap-2 rounded-full text-base leading-none tracking-wide uppercase transition-transform duration-300 focus-visible:ring-3 focus-visible:outline-none active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <Image
              src={logoImg}
              alt=""
              className="size-9 object-contain"
              priority
            />
            Essence Passos
          </SamePageScrollLink>

          <NavLinks
            className="hidden items-center gap-0.5 lg:flex"
            linkClassName="text-[0.68rem] font-semibold tracking-[0.12em] text-[#655e57] uppercase hover:text-[#231f1b]"
          />

          <div className="flex items-center gap-2">
            <SamePageScrollLink
              href={anchors.localizacao}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#231f1b] px-4 text-xs font-semibold tracking-wide text-white transition duration-300 hover:bg-[#4a4038] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
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
