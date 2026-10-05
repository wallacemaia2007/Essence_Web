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
              "nav-link-animated text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 aria-[current=page]:text-foreground gap-5 rounded-sm text-lg transition-colors focus-visible:ring-3 focus-visible:outline-none",
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
