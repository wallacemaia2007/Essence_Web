"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/common";
import { routes } from "@/constants/routes";
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
  const { direction } = useScrollDirection({ threshold: 9, topOffset: 80 });
  // No hero o header não existe. Fora dele só volta ao rolar para cima: ao
  // descer, sai de cena.
  const isHidden = !hasPassedHero || direction === "down";
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
        className="header-glass text-foreground fixed inset-x-0 top-0 z-[90] border-b backdrop-blur-md"
      >
        {/* Desktop: composição atual preservada */}
        <Container className="hidden min-h-16 items-center justify-between gap-6 lg:flex">
          <SamePageScrollLink
            href={routes.home}
            className="font-heading hover:text-primary focus-visible:ring-ring/50 flex items-center gap-2 text-xl leading-none tracking-wide uppercase transition-colors focus-visible:ring-3 focus-visible:outline-none"
          >
            <Image
              src={logoImg}
              alt="Essence Web Template"
              className="h-8 w-8 object-contain"
              priority
            />
            Essence Web
          </SamePageScrollLink>

          <NavLinks
            className="hidden items-center gap-4 lg:flex"
            linkClassName="text-sm"
          />

          <div className="flex items-center gap-2">
            <SamePageScrollLink
              href={routes.contato}
              className="bg-primary text-primary-foreground focus-visible:ring-ring/50 hover:bg-primary/85 hidden h-9 items-center rounded-md px-3 text-sm font-semibold transition focus-visible:ring-3 focus-visible:outline-none sm:inline-flex"
            >
              Contato
            </SamePageScrollLink>
          </div>
        </Container>

        {/* Mobile: barra branca com logo centralizada */}
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
