import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";

import { Container, FaqSection, ThemedSection } from "@/components/common";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { returnsPolicy } from "@/data/returns-policy";
import { absoluteUrl } from "@/lib/seo";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Trocas e devoluções | Essence",
  description: returnsPolicy.page.description,
  alternates: { canonical: absoluteUrl(routes.trocasDevolucoes) },
};

const whatsappHref = montarLinkWhatsapp(
  `https://wa.me/${contato.whatsapp}`,
  returnsPolicy.contact.whatsappMessage,
);

export default function TrocasEDevolucoesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage={returnsPolicy.page.title}
        title={returnsPolicy.page.title}
        description={returnsPolicy.page.description}
      />

      <ThemedSection
        aria-labelledby="trocas-resumo-titulo"
        className="bg-white py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#666] uppercase">
            Essence · Atendimento
          </p>
          <h2
            id="trocas-resumo-titulo"
            className="font-heading mt-3 text-2xl tracking-wide uppercase sm:text-3xl"
          >
            {returnsPolicy.summary.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#595959] sm:text-base">
            {returnsPolicy.summary.description}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {returnsPolicy.summary.cards.map((card, index) => (
              <article
                key={card.title}
                className="border border-black/10 bg-white p-6 sm:p-7"
              >
                <span className="text-xs font-semibold tracking-[0.16em] text-[#666] uppercase">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-base font-medium">{card.title}</h3>
                <p className="mt-3 text-sm font-semibold tracking-wide text-[#171717]">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#595959]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection
        aria-labelledby="trocas-passos-titulo"
        className="border-y border-black/10 bg-[#f7f7f7] py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#666] uppercase">
              Atendimento
            </p>
            <h2
              id="trocas-passos-titulo"
              className="font-heading mt-3 text-2xl tracking-wide uppercase sm:text-3xl"
            >
              {returnsPolicy.process.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#595959] sm:text-base">
              {returnsPolicy.process.description}
            </p>
          </div>
          <ol className="mt-9 grid list-none gap-4 before:hidden sm:grid-cols-2 lg:grid-cols-4">
            {returnsPolicy.process.steps.map((step) => (
              <li
                key={step.number}
                className="list-none border border-black/10 bg-white p-5 before:hidden sm:p-6"
              >
                <span className="font-heading text-3xl text-[#737373]">
                  {step.number}
                </span>
                <h3 className="mt-5 text-sm leading-6 font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#595959]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </ThemedSection>

      <ThemedSection
        aria-label="Regras por tipo de compra"
        className="bg-white py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {returnsPolicy.purchases.map((purchase) => (
              <section
                key={purchase.title}
                aria-labelledby={`${purchase.title.replaceAll(" ", "-")}-titulo`}
                className="border border-black/10 p-6 sm:p-8"
              >
                <h2
                  id={`${purchase.title.replaceAll(" ", "-")}-titulo`}
                  className="font-heading text-xl tracking-wide uppercase sm:text-2xl"
                >
                  {purchase.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#595959]">
                  {purchase.description}
                </p>
                <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
                  {purchase.rules.map((rule) => (
                    <div
                      key={rule.label}
                      className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                    >
                      <dt className="text-sm text-[#595959]">{rule.label}</dt>
                      <dd className="text-sm font-semibold text-[#171717]">
                        {rule.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection
        aria-labelledby="direito-arrependimento-titulo"
        className="border-y border-black/10 bg-[#f7f7f7] py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <article className="max-w-4xl border-l-2 border-[#171717] bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#666] uppercase">
              {returnsPolicy.withdrawal.legalBasis}
            </p>
            <h2
              id="direito-arrependimento-titulo"
              className="font-heading mt-3 text-2xl tracking-wide uppercase sm:text-3xl"
            >
              {returnsPolicy.withdrawal.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#393939] sm:text-base">
              {returnsPolicy.withdrawal.body}
            </p>
            <p className="mt-4 border-t border-black/10 pt-4 text-xs leading-6 text-[#666] sm:text-sm">
              {returnsPolicy.withdrawal.validationNote}
            </p>
          </article>
        </Container>
      </ThemedSection>

      <ThemedSection
        aria-labelledby="pecas-restricao-titulo"
        className="bg-white py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <div className="max-w-3xl">
            <h2
              id="pecas-restricao-titulo"
              className="font-heading text-2xl tracking-wide uppercase sm:text-3xl"
            >
              {returnsPolicy.exclusions.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#595959] sm:text-base">
              {returnsPolicy.exclusions.description}
            </p>
          </div>
          <ul className="mt-7 grid list-none gap-3 before:hidden sm:grid-cols-3">
            {returnsPolicy.exclusions.items.map((item) => (
              <li
                key={item.label}
                className="flex min-h-20 list-none items-center justify-between gap-4 border border-black/10 px-5 py-4 before:hidden"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="shrink-0 text-xs font-semibold tracking-wide text-[#666]">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </ThemedSection>

      <FaqSection
        id="duvidas-rapidas-trocas"
        eyebrow="Atendimento"
        title={returnsPolicy.quickFaq.title}
        description="Respostas rápidas sobre solicitações de troca e devolução."
        groups={[returnsPolicy.quickFaq]}
        structuredData={false}
      />

      <ThemedSection
        aria-labelledby="trocas-contato-titulo"
        className="bg-[#171717] py-14 text-white sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <MessageCircle className="size-7" aria-hidden="true" />
            <h2
              id="trocas-contato-titulo"
              className="font-heading mt-4 text-2xl tracking-wide uppercase sm:text-3xl"
            >
              {returnsPolicy.contact.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75 sm:text-base">
              {returnsPolicy.contact.description}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 border border-white bg-white px-7 text-xs font-semibold tracking-[0.16em] text-[#171717] uppercase transition-colors hover:bg-transparent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {returnsPolicy.contact.ctaLabel}
            </a>
          </div>
        </Container>
      </ThemedSection>
    </main>
  );
}
