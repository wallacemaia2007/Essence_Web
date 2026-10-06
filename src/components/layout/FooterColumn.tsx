"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type FooterColumnProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const titleClassName =
  "text-primary text-xs font-semibold tracking-[0.22em] uppercase";

/**
 * Coluna do footer.
 *
 * - Mobile (< md): vira acordeão. O título é um botão com `aria-expanded` e o
 *   conteúdo recolhido fica `invisible`, então não entra na ordem do Tab nem
 *   é lido por leitores de tela.
 * - Desktop (>= md): o conteúdo está sempre visível e o título é um
 *   cabeçalho comum, sem botão.
 *
 * O visual vem 100% do CSS (sem flash na hidratação); o JS só ajusta a
 * semântica do título conforme o tamanho da tela.
 */
export function FooterColumn({
  children,
  className,
  title,
}: FooterColumnProps) {
  const contentId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className={cn("border-border border-b md:border-b-0", className)}>
      <h2 className={titleClassName}>
        {isDesktop ? (
          title
        ) : (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={contentId}
            onClick={() => setIsOpen((open) => !open)}
            className="focus-visible:ring-ring/50 flex min-h-11 w-full items-center justify-between rounded-sm text-left tracking-[inherit] uppercase focus-visible:ring-3 focus-visible:outline-none"
          >
            {title}
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform duration-300 motion-reduce:transition-none",
                isOpen && "rotate-180",
              )}
            />
          </button>
        )}
      </h2>

      <div
        id={contentId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none",
          isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
          "md:visible md:grid-rows-[1fr]",
        )}
      >
        <div className="overflow-hidden md:overflow-visible">
          <div className="pt-1 pb-4 md:pt-4 md:pb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
