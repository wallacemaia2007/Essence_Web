"use client";

import { Container, SocialLinks, ThemedSection } from "@/components/common";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import { routes } from "@/constants/routes";
import { footerData, type FooterLink } from "@/data/footer";
import { socialLinks } from "@/data/social";

import { FooterColumn } from "./FooterColumn";
import { FooterNewsletter } from "./FooterNewsletter";
import { SamePageScrollLink } from "./SamePageScrollLink";

const linkClassName =
  "text-muted-foreground hover:text-primary focus-visible:ring-ring/50 inline-flex min-h-11 items-center rounded-sm text-sm transition-colors focus-visible:ring-3 focus-visible:outline-none md:min-h-8";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { contato } = footerData;
  const emailConfigurado = !contato.email
    .toLowerCase()
    .endsWith("@example.com");

  return (
    <footer>
      <ThemedSection className="relative isolate overflow-hidden border-t pt-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] md:pt-12">
        <Container className="max-w-7xl">
          <div className="grid gap-8 pb-8 md:pb-10 lg:grid-cols-2 lg:items-center lg:gap-x-16">
            <div className="text-center">
              <div className="mx-auto flex w-fit flex-col items-stretch">
                <SamePageScrollLink
                  href={routes.home}
                  className="font-heading hover:text-primary focus-visible:ring-ring/50 block rounded-sm text-center text-3xl leading-none tracking-wide uppercase transition focus-visible:ring-3 focus-visible:outline-none sm:text-4xl"
                >
                  {footerData.marca}
                </SamePageScrollLink>

                <p
                  aria-label={footerData.localidade}
                  className="font-heading text-foreground mt-2 flex justify-between text-[0.65rem] leading-none uppercase sm:text-xs"
                >
                  {Array.from(footerData.localidade).map((letter, index) => (
                    <span key={index} aria-hidden="true">
                      {letter}
                    </span>
                  ))}
                </p>
              </div>

              <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-center text-base leading-7">
                {footerData.descricaoBreve}
              </p>
            </div>

            <FooterNewsletter />
          </div>

          {/* 2. Colunas de links (acordeão no mobile) */}
          <div className="border-border border-t md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-10 md:pt-10 lg:grid-cols-5 lg:gap-x-8">
            {footerData.grupos.map((group) => (
              <FooterColumn key={group.title} title={group.title}>
                <nav aria-label={group.title}>
                  <FooterLinkList links={group.links} />
                </nav>
              </FooterColumn>
            ))}

            <FooterColumn title={contato.titulo}>
              <address className="text-muted-foreground space-y-3 text-sm leading-6 not-italic">
                <p>
                  {contato.endereco.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                {emailConfigurado ? (
                  <p>
                    <a
                      href={`mailto:${contato.email}`}
                      className="hover:text-primary focus-visible:ring-ring/50 rounded-sm transition-colors focus-visible:ring-3 focus-visible:outline-none"
                    >
                      {contato.email}
                    </a>
                  </p>
                ) : null}
                <p>
                  <a
                    href={contato.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary focus-visible:ring-ring/50 rounded-sm transition-colors focus-visible:ring-3 focus-visible:outline-none"
                  >
                    {contato.telefone}
                    <span className="sr-only"> (WhatsApp)</span>
                  </a>
                </p>
                <p>{contato.horario}</p>
              </address>
            </FooterColumn>
          </div>

          {/* 3. Redes, pagamento, copyright */}
          <div className="border-border mt-8 flex flex-col gap-8 border-t pt-8 md:mt-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-muted-foreground space-y-3 text-sm">
              <p>
                &copy; {currentYear} {footerData.marca}. Todos os direitos
                reservados.
              </p>
              <nav aria-label="Informações legais">
                <ul className="flex flex-wrap gap-x-5 gap-y-1">
                  {footerData.legal.map((link) => (
                    <li key={link.label} className="pl-0 before:hidden">
                      <SamePageScrollLink
                        href={link.href}
                        className="hover:text-primary focus-visible:ring-ring/50 inline-flex min-h-11 items-center rounded-sm transition-colors focus-visible:ring-3 focus-visible:outline-none md:min-h-8"
                      >
                        {link.label}
                      </SamePageScrollLink>
                    </li>
                  ))}
                </ul>
                <CookiePreferencesButton className="mt-2 inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none md:min-h-8">
                  Preferências de cookies
                </CookiePreferencesButton>
              </nav>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <SocialLinks links={socialLinks} />
              <ul
                aria-label="Formas de pagamento"
                className="flex flex-wrap gap-2"
              >
                {footerData.pagamentos.map((method) => (
                  <li
                    key={method}
                    className="border-border text-muted-foreground rounded-sm border px-2 py-1 pl-2 text-[0.65rem] tracking-[0.14em] uppercase before:hidden"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-muted-foreground mt-6 text-xs">
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
        </Container>
      </ThemedSection>
    </footer>
  );
}

function FooterLinkList({ links }: { links: readonly FooterLink[] }) {
  return (
    <ul>
      {links.map((link) => {
        const label = (
          <span className="nav-link-animated inline-block pb-0.5 [--underline-bottom:0px] [--underline-inset-x:0px]">
            {link.label}
            {link.external ? (
              <span className="sr-only"> (abre em uma nova aba)</span>
            ) : null}
          </span>
        );

        return (
          <li key={link.label} className="pl-0 before:hidden">
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                {label}
              </a>
            ) : (
              <SamePageScrollLink href={link.href} className={linkClassName}>
                {label}
              </SamePageScrollLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
