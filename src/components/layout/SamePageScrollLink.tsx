"use client";

import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { getCenteredScrollTarget } from "@/lib/scroll";

type SamePageScrollLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

function normalizePath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] || "/";

  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function getHash(href: string): string | null {
  const index = href.indexOf("#");

  return index === -1 ? null : href.slice(index + 1);
}

export function SamePageScrollLink({
  href,
  onNavigate,
  ...props
}: SamePageScrollLinkProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const hash = getHash(href);
  const isSamePage =
    href.startsWith("#") || normalizePath(pathname) === normalizePath(href);

  return (
    <Link
      href={href}
      scroll={!isSamePage}
      onNavigate={(event) => {
        if (!isSamePage) {
          onNavigate?.(event);
          return;
        }

        event.preventDefault();
        onNavigate?.(event);

        if (!lenis) {
          if (hash) {
            const element = document.getElementById(hash);

            if (element) {
              window.scrollTo({
                top: getCenteredScrollTarget(element, window.scrollY),
                behavior: "smooth",
              });
            }
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          return;
        }

        if (hash) {
          const element = document.getElementById(hash);
          if (element) {
            lenis.scrollTo(getCenteredScrollTarget(element, lenis.scroll));
            return;
          }
        }

        lenis.scrollTo(0);
      }}
      {...props}
    />
  );
}
