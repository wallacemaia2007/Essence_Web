"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { Container } from "@/components/common";
import { anchors, navLinks, routes } from "@/constants/routes";
import { conjuntosData } from "@/data/conjuntos";
import { megaMenuCategories, megaMenuProducts } from "@/data/header-mega-menu";
import type { ProdutoVitrine } from "@/data/vitrine";
import { caminhoDoProduto, formatarPreco } from "@/lib/produto";
import { cn } from "@/lib/utils";

import { SamePageScrollLink } from "./SamePageScrollLink";

export type DesktopMegaMenuId = "catalogo" | "conjuntos";

type DesktopMegaNavProps = {
  activeMenu: DesktopMegaMenuId | null;
  onActiveMenuChange: (menu: DesktopMegaMenuId | null) => void;
  linkClassName?: string;
  className?: string;
};

const MAX_MENU_PRODUCTS = 4;

function getMenuId(href: string): DesktopMegaMenuId | null {
  if (href === routes.colecao) return "catalogo";
  if (href === routes.conjuntos) return "conjuntos";
  return null;
}

function ProductShelf({
  id,
  title,
  description,
  href,
  products,
  showNewBadge = false,
  onNavigate,
  className,
}: {
  id: string;
  title: string;
  description: string;
  href: string;
  products: readonly ProdutoVitrine[];
  showNewBadge?: boolean;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <section aria-labelledby={`mega-shelf-${id}`} className={className}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-[#75695e] uppercase">
            {description}
          </p>
          <h3
            id={`mega-shelf-${id}`}
            className="font-heading mt-1 text-lg tracking-wide text-[#171717] uppercase"
          >
            <SamePageScrollLink
              href={href}
              onNavigate={onNavigate}
              className="rounded-sm transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {title}
            </SamePageScrollLink>
          </h3>
        </div>
        <ArrowRight
          className="mb-1 size-4 shrink-0 text-[#75695e]"
          aria-hidden="true"
        />
      </div>

      {products.length > 0 ? (
        <ul className="divide-y divide-black/10 border-t border-black/10 p-0">
          {products.slice(0, MAX_MENU_PRODUCTS).map((produto) => (
            <li key={produto.id} className="list-none p-0 before:hidden">
              <Link
                href={caminhoDoProduto(produto.id)}
                prefetch={false}
                onClick={onNavigate}
                className="group flex min-h-12 items-center justify-between gap-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[0.78rem] font-medium text-[#222222] transition-colors group-hover:text-[#75695e]">
                      {produto.nome}
                    </span>
                    {showNewBadge ? (
                      <span className="shrink-0 rounded-full bg-[#171717] px-2 py-0.5 text-[0.52rem] font-semibold tracking-[0.13em] text-white uppercase">
                        New
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2 text-[0.62rem] text-[#75695e]">
                    <span className="truncate">{produto.colecao}</span>
                    <span className="shrink-0">
                      {formatarPreco(produto.preco)}
                    </span>
                  </span>
                </span>
                <ArrowRight
                  className="size-3.5 shrink-0 text-[#8b8178] opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-t border-black/10 py-4 text-xs text-[#75695e]">
          Em breve, novas peças por aqui.
        </p>
      )}
    </section>
  );
}

function CatalogoMegaPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Container className="max-w-7xl py-6 sm:py-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-semibold tracking-[0.23em] text-[#75695e] uppercase">
            Explore por seleção
          </p>
          <h2
            id="mega-menu-heading-catalogo"
            className="font-heading mt-1 text-2xl tracking-wide text-[#171717] uppercase"
          >
            Catálogo
          </h2>
        </div>
        <Link
          href={routes.colecao}
          onClick={onNavigate}
          className="inline-flex min-h-10 items-center gap-2 text-[0.65rem] font-semibold tracking-[0.14em] text-[#171717] uppercase underline underline-offset-4 transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          Ver catálogo completo
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-6 border-t border-black/10 pt-5 md:grid-cols-3 md:gap-0 md:divide-x md:divide-black/10 md:border-t-0 md:pt-0">
        <ProductShelf
          id="novidades"
          title="Novidades"
          description="Acabaram de chegar"
          href={anchors.novidades}
          products={megaMenuProducts.novidades}
          showNewBadge
          onNavigate={onNavigate}
          className="md:pr-6"
        />
        <ProductShelf
          id="destaques"
          title="Destaques"
          description="Curadoria Essence"
          href={anchors.vitrine}
          products={megaMenuProducts.destaques}
          onNavigate={onNavigate}
          className="border-t border-black/10 pt-5 md:border-t-0 md:px-6 md:pt-0"
        />
        <section
          aria-labelledby="mega-shelf-outras-pecas"
          className="border-t border-black/10 pt-5 md:border-t-0 md:pt-0 md:pl-6"
        >
          <div className="mb-3">
            <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-[#75695e] uppercase">
              Mais para descobrir
            </p>
            <h3
              id="mega-shelf-outras-pecas"
              className="font-heading mt-1 text-lg tracking-wide text-[#171717] uppercase"
            >
              Outras peças
            </h3>
          </div>
          <ul className="grid list-none grid-cols-2 gap-x-3 gap-y-1 border-t border-black/10 p-0 pt-2">
            {megaMenuCategories.map((categoria) => (
              <li key={categoria} className="list-none p-0 before:hidden">
                <Link
                  href={`${routes.colecao}?categoria=${encodeURIComponent(categoria)}`}
                  prefetch={false}
                  onClick={onNavigate}
                  className="group flex min-h-10 items-center justify-between gap-2 border-b border-black/5 py-2 text-[0.72rem] text-[#222222] transition-colors hover:text-[#75695e] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
                >
                  <span>{categoria}</span>
                  <ArrowRight
                    className="size-3 shrink-0 text-[#8b8178] opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}

function ConjuntosMegaPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Container className="max-w-7xl py-6 sm:py-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-semibold tracking-[0.23em] text-[#75695e] uppercase">
            Escolhas da loja
          </p>
          <h2
            id="mega-menu-heading-conjuntos"
            className="font-heading mt-1 text-2xl tracking-wide text-[#171717] uppercase"
          >
            Todos os conjuntos
          </h2>
        </div>
        <Link
          href={routes.conjuntos}
          onClick={onNavigate}
          className="inline-flex min-h-10 items-center gap-2 text-[0.65rem] font-semibold tracking-[0.14em] text-[#171717] uppercase underline underline-offset-4 transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          Ver página de conjuntos
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {conjuntosData.itens.map((conjunto) => (
          <li key={conjunto.id} className="p-0 before:hidden">
            <Link
              href={conjunto.href ?? `${routes.colecao}/${conjunto.id}`}
              prefetch={false}
              onClick={onNavigate}
              className="group flex min-h-[4.5rem] items-center gap-4 border-b border-black/10 px-2 py-3 text-left transition-colors hover:bg-black/[0.025] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:px-3"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium tracking-wide text-[#222222] uppercase">
                  {conjunto.titulo}
                </span>
                {conjunto.descricao ? (
                  <span className="mt-1 line-clamp-1 block text-xs text-[#75695e]">
                    {conjunto.descricao}
                  </span>
                ) : null}
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-[#8b8178] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export function DesktopMegaNav({
  activeMenu,
  onActiveMenuChange,
  linkClassName,
  className,
}: DesktopMegaNavProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const suppressFocusOpenRef = useRef(false);

  const handleMouseLeave = () => {
    if (!rootRef.current?.contains(document.activeElement)) {
      onActiveMenuChange(null);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      onActiveMenuChange(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !activeMenu) return;

    event.preventDefault();
    const trigger = rootRef.current?.querySelector<HTMLAnchorElement>(
      `[data-mega-trigger="${activeMenu}"]`,
    );
    onActiveMenuChange(null);

    if (trigger && document.activeElement !== trigger) {
      suppressFocusOpenRef.current = true;
      trigger.focus();
    }
  };

  const closeMenu = () => onActiveMenuChange(null);

  return (
    <div
      ref={rootRef}
      className="relative flex h-[4.25rem] items-center"
      onMouseLeave={handleMouseLeave}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <nav aria-label="Navegação principal" className={className}>
        {navLinks.map((link) => {
          const menuId = getMenuId(link.href);
          const linkPath = link.href.split(/[?#]/, 1)[0] || "/";
          const isActive =
            !link.href.includes("#") &&
            (pathname === linkPath ||
              (linkPath !== "/" && pathname.startsWith(`${linkPath}/`)));

          return (
            <SamePageScrollLink
              key={link.href}
              id={menuId ? `header-mega-trigger-${menuId}` : undefined}
              data-mega-trigger={menuId ?? undefined}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              aria-expanded={menuId ? activeMenu === menuId : undefined}
              aria-controls={menuId ? "header-mega-menu" : undefined}
              onMouseEnter={() => onActiveMenuChange(menuId)}
              onFocus={() => {
                if (suppressFocusOpenRef.current) {
                  suppressFocusOpenRef.current = false;
                  return;
                }
                onActiveMenuChange(menuId);
              }}
              onNavigate={closeMenu}
              className={cn(
                "nav-link-animated focus-visible:ring-ring/50 inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-medium text-[#000000] hover:text-[#000000] focus-visible:ring-3 focus-visible:outline-none aria-[current=page]:text-[#000000]",
                linkClassName,
              )}
            >
              {link.label}
              {menuId ? (
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
                    activeMenu === menuId && "rotate-180",
                  )}
                />
              ) : null}
            </SamePageScrollLink>
          );
        })}
      </nav>

      <div
        id="header-mega-menu"
        data-state={activeMenu ? "open" : "closed"}
        role="region"
        aria-labelledby={
          activeMenu ? `mega-menu-heading-${activeMenu}` : undefined
        }
        aria-hidden={!activeMenu}
        inert={!activeMenu ? true : undefined}
        className={cn(
          "fixed left-1/2 z-[95] max-h-[calc(100dvh-5rem)] w-[min(72rem,calc(100vw-2*clamp(0.75rem,2.2vw,1.75rem)))] origin-top -translate-x-1/2 overflow-y-auto rounded-t-none rounded-b-[1.75rem] border border-t-0 border-black/10 bg-white text-[#171717] shadow-none transition-[opacity,translate,scale,visibility] duration-300 ease-out motion-reduce:transition-none",
          activeMenu
            ? "visible translate-y-0 scale-y-100 opacity-100"
            : "pointer-events-none invisible -translate-y-3 scale-y-95 opacity-0",
        )}
        style={{
          top: "calc(max(0.65rem, env(safe-area-inset-top)) + 4.25rem)",
        }}
      >
        {activeMenu === "catalogo" ? (
          <CatalogoMegaPanel onNavigate={closeMenu} />
        ) : activeMenu === "conjuntos" ? (
          <ConjuntosMegaPanel onNavigate={closeMenu} />
        ) : null}
      </div>
    </div>
  );
}
