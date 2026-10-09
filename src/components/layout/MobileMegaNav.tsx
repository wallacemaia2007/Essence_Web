"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { anchors, navLinks, routes } from "@/constants/routes";
import { conjuntosData } from "@/data/conjuntos";
import { megaMenuCategories, megaMenuProducts } from "@/data/header-mega-menu";
import { caminhoDoProduto, formatarPreco } from "@/lib/produto";
import { cn } from "@/lib/utils";

import type { DesktopMegaMenuId } from "./DesktopMegaNav";
import { SamePageScrollLink } from "./SamePageScrollLink";

type MobileMegaNavProps = {
  onNavigate: () => void;
  className?: string;
  linkClassName?: string;
};

const mobileShelfSections = [
  {
    id: "novidades",
    label: "Novidades",
    href: anchors.novidades,
    products: megaMenuProducts.novidades,
    showNewBadge: true,
  },
  {
    id: "destaques",
    label: "Destaques",
    href: anchors.vitrine,
    products: megaMenuProducts.destaques,
    showNewBadge: false,
  },
] as const;

function MobileCatalogSubmenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mt-1 space-y-3 border-l border-black/15 py-2 pl-4">
      {mobileShelfSections.map((section) => (
        <section key={section.id} aria-label={section.label}>
          <Link
            href={section.href}
            onClick={onNavigate}
            className="inline-flex min-h-9 items-center text-[0.68rem] font-semibold tracking-[0.14em] text-[#171717] uppercase underline underline-offset-4"
          >
            {section.label}
          </Link>
          <ul className="divide-y divide-black/10 p-0">
            {section.products.slice(0, 3).map((product) => (
              <li key={product.id} className="list-none p-0 before:hidden">
                <Link
                  href={caminhoDoProduto(product.id)}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center justify-between gap-3 py-2 text-left"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-xs font-medium text-[#222222]">
                        {product.nome}
                      </span>
                      {section.showNewBadge ? (
                        <span className="shrink-0 rounded-full bg-[#171717] px-1.5 py-0.5 text-[0.5rem] font-semibold tracking-[0.12em] text-white uppercase">
                          New
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[0.65rem] text-[#75695e]">
                      {formatarPreco(product.preco)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section aria-labelledby="mobile-mega-outras-pecas">
        <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-[#75695e] uppercase">
          Mais para descobrir
        </p>
        <h3
          id="mobile-mega-outras-pecas"
          className="font-heading mt-1 text-base tracking-wide text-[#171717] uppercase"
        >
          Outras peças
        </h3>
        <ul className="mt-2 grid list-none grid-cols-2 gap-x-3 border-t border-black/10 p-0 pt-2">
          {megaMenuCategories.map((categoria) => (
            <li key={categoria} className="list-none p-0 before:hidden">
              <Link
                href={`${routes.colecao}?categoria=${encodeURIComponent(categoria)}`}
                onClick={onNavigate}
                className="flex min-h-10 items-center border-b border-black/5 py-2 text-xs text-[#222222]"
              >
                {categoria}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Link
        href={routes.colecao}
        onClick={onNavigate}
        className="inline-flex min-h-10 items-center text-xs font-semibold text-[#171717] underline underline-offset-4"
      >
        Ver catálogo completo
      </Link>
      <Link
        href={routes.outlet}
        onClick={onNavigate}
        className="inline-flex min-h-10 items-center text-xs font-semibold text-[#171717] underline underline-offset-4"
      >
        Ver ofertas no Outlet
      </Link>
    </div>
  );
}

function MobileConjuntosSubmenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mt-1 border-l border-black/15 py-1 pl-4">
      {conjuntosData.itens.map((conjunto) => (
        <Link
          key={conjunto.id}
          href={conjunto.href ?? `${routes.colecao}/${conjunto.id}`}
          onClick={onNavigate}
          className="flex min-h-11 items-center justify-between gap-3 border-b border-black/10 py-2 text-sm text-[#222222]"
        >
          <span>{conjunto.titulo}</span>
          <span className="text-xs text-[#75695e]" aria-hidden="true">
            →
          </span>
        </Link>
      ))}
      <Link
        href={routes.conjuntos}
        onClick={onNavigate}
        className="inline-flex min-h-10 items-center text-xs font-semibold text-[#171717] underline underline-offset-4"
      >
        Ver página de conjuntos
      </Link>
    </div>
  );
}

export function MobileMegaNav({
  onNavigate,
  className,
  linkClassName,
}: MobileMegaNavProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<DesktopMegaMenuId | null>(
    null,
  );
  const handleNavigate = () => {
    setExpandedMenu(null);
    onNavigate();
  };

  return (
    <nav aria-label="Navegação principal" className={className}>
      {navLinks.map((link) => {
        const menuId: DesktopMegaMenuId | null =
          link.href === routes.colecao
            ? "catalogo"
            : link.href === routes.conjuntos
              ? "conjuntos"
              : null;
        const linkPath = link.href.split(/[?#]/, 1)[0] || "/";
        const isActive =
          !link.href.includes("#") &&
          (pathname === linkPath ||
            (linkPath !== "/" && pathname.startsWith(`${linkPath}/`)));
        const expanded = menuId !== null && expandedMenu === menuId;

        return (
          <div key={link.href}>
            <div className="flex items-center gap-1">
              <SamePageScrollLink
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onNavigate={handleNavigate}
                className={cn(
                  "nav-link-animated focus-visible:ring-ring/50 min-h-12 flex-1 rounded-lg text-left text-sm font-medium text-[#000000] hover:text-[#000000] focus-visible:ring-3 focus-visible:outline-none aria-[current=page]:text-[#000000]",
                  linkClassName,
                )}
              >
                {link.label}
              </SamePageScrollLink>
              {menuId ? (
                <button
                  type="button"
                  aria-label={`${expanded ? "Recolher" : "Expandir"} opções de ${link.label}`}
                  aria-expanded={expanded}
                  aria-controls={`mobile-submenu-${menuId}`}
                  onClick={() =>
                    setExpandedMenu((current) =>
                      current === menuId ? null : menuId,
                    )
                  }
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[#000000] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-4 transition-transform duration-200 motion-reduce:transition-none",
                      expanded && "rotate-180",
                    )}
                  />
                </button>
              ) : null}
            </div>

            {menuId ? (
              <div
                id={`mobile-submenu-${menuId}`}
                aria-hidden={!expanded}
                inert={!expanded ? true : undefined}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none",
                  expanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  {menuId === "catalogo" ? (
                    <MobileCatalogSubmenu onNavigate={handleNavigate} />
                  ) : (
                    <MobileConjuntosSubmenu onNavigate={handleNavigate} />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
