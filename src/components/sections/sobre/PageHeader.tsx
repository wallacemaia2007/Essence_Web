import Link from "next/link";
import type { ReactNode } from "react";

import { Container, ThemedSection } from "@/components/common";
import { routes } from "@/constants/routes";

type PageHeaderProps = {
  title: string;
  description: string;
  currentPage: string;
  compact?: boolean;
  compactBottom?: boolean;
  children?: ReactNode;
};

export function PageHeader({
  children,
  currentPage,
  description,
  title,
  compact = false,
  compactBottom = false,
}: PageHeaderProps) {
  return (
    <ThemedSection
      className={
        compact
          ? "sobre-page__page-header border-b pt-24 pb-5 md:pt-28 md:pb-6"
          : compactBottom
            ? "border-b pt-16 pb-6 md:pt-20 md:pb-8"
            : "border-b py-16 md:py-20"
      }
    >
      <Container>
        <nav
          aria-label="Breadcrumb"
          className={`text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase ${compact ? "mt-2" : "mt-6"}`}
        >
          <Link href={routes.home} className="hover:text-primary transition">
            Início
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{currentPage}</span>
        </nav>

        <h1
          className={`font-heading max-w-4xl text-4xl leading-tight tracking-wide uppercase md:text-6xl ${compact ? "mt-3" : "mt-5"}`}
        >
          {title}
        </h1>
        <p
          className={`text-muted-foreground max-w-3xl ${compact ? "mt-3 text-base leading-7" : "mt-5 text-lg leading-8"}`}
        >
          {description}
        </p>
        {children ? (
          <div className={compact ? "mt-5" : "mt-10"}>{children}</div>
        ) : null}
      </Container>
    </ThemedSection>
  );
}
