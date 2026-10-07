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
        const linkPath = link.href.split(/[?#]/, 1)[0] || "/";
        const isActive =
          !link.href.includes("#") &&
          (pathname === linkPath ||
            (linkPath !== "/" && pathname.startsWith(`${linkPath}/`)));

        return (
          <SamePageScrollLink
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            onNavigate={onNavigate}
            className={cn(
              "nav-link-animated focus-visible:ring-ring/50 inline-flex items-center rounded-full px-2.5 py-2 text-sm font-medium text-[#000000] hover:text-[#000000] focus-visible:ring-3 focus-visible:outline-none aria-[current=page]:text-[#000000]",
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
