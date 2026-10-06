"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";

import { Container } from "@/components/common";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { useHasPassedHero } from "@/hooks/useHasPassedHero";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import logoImg from "../../../public/images/logo.svg";

import { MobileSidebar } from "./MobileSidebar";
import { NavLinks } from "./NavLinks";
import { SamePageScrollLink } from "./SamePageScrollLink";

const HEADER_HEIGHT = 64;

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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

  const onEdgeTouchStart = useCallback((e: TouchEvent) => {
    const x = e.touches[0].clientX;
    if (x >= window.innerWidth - 30) {
      touchStart.current = { x, y: e.touches[0].clientY };
    }
  }, []);

  const onEdgeTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx > -50) return;

    setIsSidebarOpen(true);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) return;

    document.addEventListener("touchstart", onEdgeTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", onEdgeTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onEdgeTouchStart);
      document.removeEventListener("touchend", onEdgeTouchEnd);
    };
  }, [isSidebarOpen, onEdgeTouchStart, onEdgeTouchEnd]);

  return (
    <>
      <header
        data-header-theme={headerTheme}
        data-variant={hasPassedHero ? "site" : "intro"}
        data-state={isHidden ? "hidden" : "visible"}
        data-hero-state={hasMeasured ? "measured" : "pending"}
        inert={isHidden && !isSidebarOpen ? true : undefined}
        className="header-glass text-foreground fixed inset-x-0 top-0 z-[90] border-b backdrop-blur-md"
      >
        <Container className="flex min-h-16 items-center justify-between gap-6">
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

            <Button
              ref={menuButtonRef}
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
              aria-controls="mobile-sidebar"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden"
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </header>

      <div id="mobile-sidebar">
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          returnFocusRef={menuButtonRef}
        />
      </div>
    </>
  );
}
