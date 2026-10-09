import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container, FaqSection, ThemedSection } from "@/components/common";
import { FreteCalculator } from "@/components/sections/entrega/FreteCalculator";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { footerData } from "@/data/footer";
import { localizacaoLoja } from "@/data/localizacao";
import { shippingInfo } from "@/data/shipping";
import { absoluteUrl } from "@/lib/seo";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Entrega e frete | Essence",
  description: shippingInfo.page.description,
  alternates: { canonical: absoluteUrl(routes.entregaFrete) },
};

const whatsappHref = montarLinkWhatsapp(
  `https://wa.me/${contato.whatsapp}`,
  shippingInfo.contact.whatsappMessage,
);

export default function EntregaEFretePage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage={shippingInfo.page.title}
        title={shippingInfo.page.title}
        description={shippingInfo.page.description}
      />

      <ThemedSection
        aria-labelledby="entrega-modalidades-titulo"
        className="bg-white py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#666] uppercase">
              Essence · Passos
            </p>
            <h2
              id="entrega-modalidades-titulo"
              className="font-heading mt-3 text-2xl tracking-wide uppercase sm:text-3xl"
            >
              {shippingInfo.methods.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#595959] sm:text-base">
              {shippingInfo.methods.description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {shippingInfo.methods.items.map((method) => (
              <article
                key={method.id}
                className="flex h-full flex-col border border-black/10 bg-white p-6 sm:p-7"
              >
                <h3 className="font-heading text-xl tracking-wide uppercase">
                  {method.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#595959]">
                  {method.description}
                </p>

                {method.id === "pickup" ? (
                  <div className="mt-5 space-y-4 border-y border-black/10 py-4">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-[#666]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#666]">
                          {shippingInfo.pickup.addressLabel}
                        </p>
                        <address className="mt-1 text-sm leading-6 not-italic">
                          {localizacaoLoja.enderecoCompleto}
                        </address>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#666]">
                        {shippingInfo.pickup.hoursLabel}
                      </p>
                      <p className="mt-1 text-sm leading-6">
                        {footerData.contato.horario}
                      </p>
                    </div>
                  </div>
                ) : null}

                <dl className="mt-5 divide-y divide-black/10 border-y border-black/10">
                  {method.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <dt className="text-sm text-[#666]">{detail.label}</dt>
                      <dd className="text-right text-sm font-semibold text-[#171717]">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {method.id === "pickup" ? (
                  <a
                    href={localizacaoLoja.comoChegarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-12 items-center gap-2 border-b border-[#171717]/40 pt-4 text-xs font-bold tracking-[0.1em] text-[#171717] uppercase transition hover:-translate-y-0.5 hover:border-[#666] hover:text-[#666] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] motion-reduce:transform-none motion-reduce:transition-none"
                    aria-label="Abrir rotas para a loja Essence no Google Maps em uma nova aba"
                  >
                    {shippingInfo.pickup.directionsLabel}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection
        aria-label="Consulta de frete"
        className="border-y border-black/10 bg-[#f7f7f7] py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:gap-14">
            <section aria-labelledby="calcule-frete-titulo">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#666] uppercase">
                CEP de destino
              </p>
              <h2
                id="calcule-frete-titulo"
                className="font-heading mt-3 text-2xl tracking-wide uppercase sm:text-3xl"
              >
                {shippingInfo.calculator.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#595959] sm:text-base">
                {shippingInfo.calculator.description}
              </p>
              <FreteCalculator />
            </section>

            <aside className="border border-black/10 bg-white p-6 sm:p-7">
              <h2 className="font-heading text-xl tracking-wide uppercase">
                {shippingInfo.freeShipping.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#595959]">
                {shippingInfo.freeShipping.description}
              </p>
              <dl className="mt-5 divide-y divide-black/10 border-y border-black/10">
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="text-sm text-[#666]">
                    {shippingInfo.freeShipping.minimumLabel}
                  </dt>
                  <dd className="text-right text-sm font-semibold">
                    {shippingInfo.freeShipping.minimumValue}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="text-sm text-[#666]">
                    {shippingInfo.freeShipping.conditionsLabel}
                  </dt>
                  <dd className="max-w-[12rem] text-right text-sm font-semibold">
                    {shippingInfo.freeShipping.conditionsValue}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection
        aria-labelledby="acompanhe-pedido-titulo"
        className="bg-white py-14 text-[#171717] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <section className="grid gap-6 border-b border-black/10 pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#666] uppercase">
                Depois do envio
              </p>
              <h2
                id="acompanhe-pedido-titulo"
                className="font-heading mt-3 text-2xl tracking-wide uppercase sm:text-3xl"
              >
                {shippingInfo.tracking.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#595959] sm:text-base">
                {shippingInfo.tracking.description}
              </p>
            </div>
            {shippingInfo.tracking.ordersPageAvailable ? (
              <Link
                href={shippingInfo.tracking.ordersPath}
                className="inline-flex min-h-11 items-center justify-center border border-[#171717] px-5 text-xs font-semibold tracking-[0.12em] text-[#171717] uppercase transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                {shippingInfo.tracking.linkLabel}
              </Link>
            ) : (
              <p className="text-sm text-[#666]">
                {shippingInfo.tracking.unavailableMessage}
              </p>
            )}
          </section>
        </Container>
      </ThemedSection>

      <FaqSection
        id="duvidas-entrega-frete"
        eyebrow="Atendimento"
        title="Dúvidas sobre entrega"
        description="Informações sobre prazos, rastreio e condições de frete. Itens marcados como PLACEHOLDER aguardam confirmação da loja."
        groups={[shippingInfo.quickFaq]}
        structuredData={false}
      />

      <ThemedSection
        aria-labelledby="entrega-contato-titulo"
        className="bg-[#171717] py-14 text-white sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <MessageCircle className="size-7" aria-hidden="true" />
            <h2
              id="entrega-contato-titulo"
              className="font-heading mt-4 text-2xl tracking-wide uppercase sm:text-3xl"
            >
              {shippingInfo.contact.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75 sm:text-base">
              {shippingInfo.contact.description}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 border border-white bg-white px-7 text-xs font-semibold tracking-[0.16em] text-[#171717] uppercase transition-colors hover:bg-transparent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {shippingInfo.contact.ctaLabel}
            </a>
          </div>
        </Container>
      </ThemedSection>
    </main>
  );
}
