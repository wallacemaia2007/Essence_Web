"use client";

import Image from "next/image";

import {
  Container,
  SocialLinks,
  ThemedSection,
} from "@/components/common";
import { navLinks, routes } from "@/constants/routes";
import { footerData } from "@/data/footer";
import { socialLinks } from "@/data/social";
import logoImg from "../../../public/images/logo.svg";

import { SamePageScrollLink } from "./SamePageScrollLink";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <ThemedSection className="relative isolate overflow-hidden border-t py-12 md:py-16">
        <Container className="relative z-10 max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[minmax(20rem,1fr)_minmax(26rem,0.95fr)_minmax(0,0.35fr)] md:gap-12 lg:gap-16">
            <div className="max-w-md">
              <Image
                src={logoImg}
                alt="Essence Web Template"
                className="mb-5 h-11 w-11 object-contain"
              />
              <SamePageScrollLink
                href={routes.home}
                className="font-heading hover:text-primary text-3xl leading-none tracking-wide uppercase transition sm:text-4xl"
              >
                Essence Web
              </SamePageScrollLink>
              <p className="text-muted-foreground mt-5 max-w-sm text-base leading-7">
                {footerData.descricaoBreve}
              </p>
              <SocialLinks links={socialLinks} className="mt-6" />
            </div>

            <div className="grid gap-10 sm:grid-cols-2 md:gap-16 md:justify-self-center lg:gap-24">
              <FooterLinkColumn title="Seções" ariaLabel="Seções do site">
                {navLinks.map((link) => (
                  <li key={link.href} className="pl-0 before:hidden">
                    <SamePageScrollLink
                      href={link.href}
                      className="text-muted-foreground hover:text-primary focus-visible:ring-ring/50 inline-flex rounded-sm py-1 transition focus-visible:ring-3 focus-visible:outline-none"
                    >
                      {link.label}
                    </SamePageScrollLink>
                  </li>
                ))}
              </FooterLinkColumn>

              <FooterLinkColumn title="Links úteis" ariaLabel="Links úteis">
                {footerData.linksUteis.map((link) => (
                  <li key={link.label} className="pl-0 before:hidden">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary focus-visible:ring-ring/50 inline-flex rounded-sm py-1 transition focus-visible:ring-3 focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </FooterLinkColumn>
            </div>
          </div>

          <div className="border-border text-muted-foreground mt-10 flex flex-col gap-3 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between">
            <p>
              &copy; {currentYear} Essence Web Template. Todos os direitos
              reservados.
            </p>
            <p>
              {footerData.creditos.prefixo}{" "}
              <a
                href={footerData.creditos.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 focus-visible:ring-ring/50 rounded-sm font-medium underline-offset-4 transition hover:underline focus-visible:ring-3 focus-visible:outline-none"
              >
                {footerData.creditos.nome}
              </a>
            </p>
          </div>
        </Container>
      </ThemedSection>
    </footer>
  );
}

type FooterLinkColumnProps = {
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
};

function FooterLinkColumn({
  ariaLabel,
  children,
  title,
}: FooterLinkColumnProps) {
  return (
    <nav aria-label={ariaLabel}>
      <h2 className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-2 text-sm">{children}</ul>
    </nav>
  );
}