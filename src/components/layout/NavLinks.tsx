"use client";

import { usePathname } from "next/navigation";

import { navLinks } from "@/constants/routes";
import { cn } from "@/lib/utils";

import { SamePageScrollLink } from "./SamePageScrollLink";

type NavLinksProps = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({
  className,
  linkClassName,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className={className}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <SamePageScrollLink
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            onNavigate={onNavigate}
            className={cn(
              "nav-link-animated focus-visible:ring-ring/50 inline-flex items-center rounded-full px-2.5 py-2 text-sm font-medium text-[#655e57] hover:text-[#231f1b] focus-visible:ring-3 focus-visible:outline-none aria-[current=page]:text-[#231f1b]",
              linkClassName,
            )}
          >
            {link.label}
          </SamePageScrollLink>
        );
      })}
    </nav>
  );
}
