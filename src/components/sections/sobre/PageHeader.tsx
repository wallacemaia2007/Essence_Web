import Link from "next/link";
import type { ReactNode } from "react";

import { Container, ThemedSection } from "@/components/common";
import { routes } from "@/constants/routes";

type PageHeaderProps = {
  title: string;
  description: string;
  currentPage: string;
  children?: ReactNode;
};

export function PageHeader({
  children,
  currentPage,
  description,
  title,
}: PageHeaderProps) {
  return (
    <ThemedSection className="border-b py-16 md:py-20">
      <Container>
        <div className="text-primary"></div>

        <nav
          aria-label="Breadcrumb"
          className="text-muted-foreground mt-6 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase"
        >
          <Link href={routes.home} className="hover:text-primary transition">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{currentPage}</span>
        </nav>

        <h1 className="font-heading mt-5 max-w-4xl text-4xl leading-tight tracking-wide uppercase md:text-6xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
          {description}
        </p>
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </ThemedSection>
  );
}
