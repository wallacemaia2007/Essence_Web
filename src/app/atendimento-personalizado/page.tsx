import type { Metadata } from "next";
import Link from "next/link";

import { Container, ThemedSection } from "@/components/common";
import { PersonalServiceRequestForm } from "@/components/sections/atendimento-personalizado/PersonalServiceRequestForm";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";
import { localizacaoLoja } from "@/data/localizacao";
import {
  personalServiceOptions,
  personalServiceSteps,
} from "@/data/personal-service";
import { storeHours } from "@/data/store-hours";

const pageTitle = "Atendimento personalizado | Essence Passos";
const pageDescription =
  "Agende um provador, peça ajuda com looks ou converse com a equipe da Essence pelo WhatsApp. Um atendimento próximo, no seu tempo.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: routes.atendimentoPersonalizado },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: routes.atendimentoPersonalizado,
    type: "website",
  },
};

export default function AtendimentoPersonalizadoPage() {
  return (
    <main className="flex flex-1 flex-col bg-white text-[#231f1b]">
      <PageHeader
        currentPage="Atendimento personalizado"
        title="Um atendimento feito para você."
        description="Agende uma visita, conte sobre o look que procura ou converse com nossa equipe. A gente ajuda você a encontrar peças que façam sentido para o seu momento."
      >
        <Link
          href="#solicitar"
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#231f1b] px-6 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
        >
          Quero solicitar um atendimento
        </Link>
      </PageHeader>

      <ThemedSection className="bg-[#f7f6f4] py-14 md:py-20">
        <Container>
          <div className="mb-8 max-w-2xl md:mb-10">
            <p className="m-0 text-xs font-semibold tracking-[0.18em] text-[#756d65] uppercase">
              Um cuidado de perto
            </p>
            <h2 className="font-heading mt-3 mb-0 text-3xl leading-tight tracking-wide uppercase sm:text-4xl">
              Como podemos ajudar?
            </h2>
            <p className="mt-4 mb-0 text-sm leading-7 text-[#655e57] sm:text-base">
              Escolha o tipo de atendimento que combina com você. A equipe
              confirma a disponibilidade pelo WhatsApp.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {personalServiceOptions.map((service, index) => (
              <article
                key={service.value}
                className="flex h-full flex-col border border-[#231f1b]/12 bg-white p-5 sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="text-xs font-semibold tracking-[0.2em] text-[#8a6746]"
                >
                  0{index + 1}
                </span>
                <h3 className="mt-5 mb-0 text-lg font-semibold tracking-wide">
                  {service.title}
                </h3>
                <p className="mt-3 mb-0 text-sm leading-6 text-[#655e57]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection className="bg-white py-14 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14">
            <div>
              <p className="m-0 text-xs font-semibold tracking-[0.18em] text-[#756d65] uppercase">
                Simples assim
              </p>
              <h2 className="font-heading mt-3 mb-0 text-3xl leading-tight tracking-wide uppercase sm:text-4xl">
                Da ideia à prova
              </h2>
              <p className="mt-4 mb-0 max-w-md text-sm leading-7 text-[#655e57] sm:text-base">
                Você conta o que precisa, a equipe conversa com você e combina
                os próximos passos.
              </p>
            </div>

            <ol className="grid gap-4 md:grid-cols-3">
              {personalServiceSteps.map((step) => (
                <li
                  key={step.number}
                  className="border-t border-[#231f1b]/25 pt-4"
                >
                  <span className="text-xs font-semibold tracking-[0.2em] text-[#8a6746]">
                    {step.number}
                  </span>
                  <h3 className="mt-3 mb-0 text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 mb-0 text-sm leading-6 text-[#655e57]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection
        id="solicitar"
        aria-labelledby="personal-service-form-title"
        className="scroll-mt-24 bg-[#f7f6f4] py-14 md:py-20"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(20rem,1.2fr)] lg:items-start lg:gap-14">
            <div className="max-w-xl">
              <p className="m-0 text-xs font-semibold tracking-[0.18em] text-[#756d65] uppercase">
                Vamos conversar
              </p>
              <h2
                id="personal-service-form-title"
                className="font-heading mt-3 mb-0 text-3xl leading-tight tracking-wide uppercase sm:text-4xl"
              >
                Conte para a gente o que você precisa.
              </h2>
              <p className="mt-4 mb-0 text-sm leading-7 text-[#655e57] sm:text-base">
                Preencha seus dados e preferências. A solicitação será preparada
                para abrir no WhatsApp; a equipe confirma o horário por lá.
              </p>
              <div className="mt-6 border-l-2 border-[#8a6746] pl-4 text-sm leading-6 text-[#39332d]">
                <p className="m-0 font-semibold">
                  Um pedido, não uma confirmação automática
                </p>
                <p className="mt-1 mb-0 text-[#655e57]">
                  A data e o período são preferências. O atendimento só fica
                  combinado depois que a equipe confirmar a disponibilidade no
                  WhatsApp.
                </p>
              </div>
            </div>

            <PersonalServiceRequestForm />
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection
        id="como-chegar"
        aria-labelledby="personal-service-location-title"
        className="bg-white py-14 md:py-20"
      >
        <Container>
          <div className="grid gap-8 border-t border-[#231f1b]/15 pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12 md:pt-10">
            <div>
              <p className="m-0 text-xs font-semibold tracking-[0.18em] text-[#756d65] uppercase">
                Passos, Minas Gerais
              </p>
              <h2
                id="personal-service-location-title"
                className="font-heading mt-3 mb-0 text-3xl leading-tight tracking-wide uppercase sm:text-4xl"
              >
                Como chegar
              </h2>
              <address className="mt-4 text-sm leading-7 text-[#39332d] not-italic sm:text-base">
                {localizacaoLoja.enderecoCompleto}
              </address>
              <p className="mt-2 mb-0 text-sm text-[#655e57]">
                Horário da loja: {storeHours.summary}
              </p>
              <p className="mt-3 mb-0 max-w-2xl text-sm leading-6 text-[#655e57]">
                Antes de sair, aguarde a confirmação do atendimento pelo
                WhatsApp. O link abaixo abre as rotas no Google Maps sem
                carregar um mapa incorporado nesta página.
              </p>
            </div>
            <a
              href={localizacaoLoja.comoChegarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#231f1b]/35 px-5 text-xs font-semibold tracking-[0.12em] text-[#231f1b] uppercase transition-colors hover:bg-[#231f1b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
            >
              Abrir rotas no Maps
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Container>
      </ThemedSection>
    </main>
  );
}
