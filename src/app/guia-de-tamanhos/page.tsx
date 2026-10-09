import { ArrowRight, MessageCircle, Ruler } from "lucide-react";
import type { Metadata } from "next";

import { Container, SectionTitle, ThemedSection } from "@/components/common";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { type SizeGuideMeasurement, sizeGuideRows } from "@/data/size-guide";
import { absoluteUrl } from "@/lib/seo";

const description =
  "Aprenda a tirar suas medidas e consulte a tabela de tamanhos da Essence antes de escolher sua peça.";
const whatsappMessage =
  "Olá! Preciso de ajuda para escolher meu tamanho na Essence.";
const whatsappHref = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

export const metadata: Metadata = {
  title: { absolute: "Guia de tamanhos | Essence" },
  description,
  alternates: { canonical: absoluteUrl(routes.guiaTamanhos) },
  openGraph: {
    title: "Guia de tamanhos | Essence",
    description,
    url: absoluteUrl(routes.guiaTamanhos),
    type: "website",
  },
};

const steps = [
  {
    number: "01",
    title: "Busto",
    description:
      "Passe a fita pela parte mais larga do busto, mantendo-a nivelada e sem apertar.",
  },
  {
    number: "02",
    title: "Cintura",
    description:
      "Meça a parte mais estreita do tronco, sem prender a respiração ou comprimir a fita.",
  },
  {
    number: "03",
    title: "Quadril",
    description:
      "Contorne a parte mais larga do quadril, com os pés juntos e a fita paralela ao chão.",
  },
] as const;

function formatMeasurement(value: SizeGuideMeasurement) {
  return value === "PLACEHOLDER" ? "PLACEHOLDER" : `${value} cm`;
}

export default function GuiaDeTamanhosPage() {
  return (
    <main className="flex flex-1 flex-col bg-white text-[#231f1b]">
      <PageHeader
        currentPage="Guia de tamanhos"
        title="Guia de tamanhos"
        description={description}
      />

      <ThemedSection className="bg-white py-12 md:py-20">
        <Container className="max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <div>
              <SectionTitle
                eyebrow="Tabela de medidas"
                title="Compare suas medidas"
                description="Use uma fita métrica e compare os resultados com a tabela abaixo. Os campos ainda estão pendentes de confirmação da loja."
              />

              <div className="mt-8 flex items-start gap-3 border border-[#e5e5e5] bg-[#fafafa] p-4 text-sm leading-6 text-[#655e57]">
                <Ruler
                  className="mt-0.5 size-5 shrink-0 text-[#74685f]"
                  aria-hidden="true"
                />
                <p>
                  As medidas devem ser tiradas diretamente no corpo, sem apertar
                  a fita.
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <div
                role="region"
                aria-label="Tabela de medidas por tamanho"
                tabIndex={0}
                className="overflow-x-auto border border-[#e5e5e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
              >
                <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Tabela de medidas da Essence em centímetros
                  </caption>
                  <thead className="bg-[#f7f7f7] text-xs tracking-[0.16em] text-[#655e57] uppercase">
                    <tr>
                      <th
                        scope="col"
                        className="sticky left-0 z-10 border-b border-[#e5e1dd] bg-[#f7f7f7] px-4 py-4 font-semibold"
                      >
                        Tamanho
                      </th>
                      <th
                        scope="col"
                        className="border-b border-[#e5e1dd] px-4 py-4 font-semibold"
                      >
                        Busto (cm)
                      </th>
                      <th
                        scope="col"
                        className="border-b border-[#e5e1dd] px-4 py-4 font-semibold"
                      >
                        Cintura (cm)
                      </th>
                      <th
                        scope="col"
                        className="border-b border-[#e5e1dd] px-4 py-4 font-semibold"
                      >
                        Quadril (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuideRows.map((row) => (
                      <tr
                        key={row.tamanho}
                        className="group border-b border-[#e5e1dd] transition-colors last:border-b-0 hover:bg-[#fafafa]"
                      >
                        <th
                          scope="row"
                          className="sticky left-0 z-10 bg-white px-4 py-4 font-medium text-[#231f1b] transition-colors group-hover:bg-[#fafafa]"
                        >
                          {row.tamanho}
                        </th>
                        <td className="px-4 py-4 text-[#655e57]">
                          {formatMeasurement(row.busto)}
                        </td>
                        <td className="px-4 py-4 text-[#655e57]">
                          {formatMeasurement(row.cintura)}
                        </td>
                        <td className="px-4 py-4 text-[#655e57]">
                          {formatMeasurement(row.quadril)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#74685f]">
                Valores em centímetros.{" "}
                <span className="font-medium">PLACEHOLDER</span> = medida a
                confirmar com a loja.
              </p>
            </div>
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection className="border-t border-[#e5e1dd] bg-[#fafafa] py-12 md:py-20">
        <Container className="max-w-6xl">
          <SectionTitle
            eyebrow="Passo a passo"
            title="Como se medir"
            description="Faça as medidas usando roupas leves ou diretamente sobre o corpo."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="border border-[#e5e1dd] bg-white p-6"
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-[#74685f]">
                  {step.number}
                </p>
                <h3 className="font-heading mt-5 text-2xl tracking-wide uppercase">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#655e57]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex min-h-32 items-center justify-center border border-dashed border-[#d4d4d4] bg-white p-6 text-center text-sm text-[#74685f]">
            Ilustração de medidas — espaço reservado para uma futura imagem da
            loja.
          </div>
        </Container>
      </ThemedSection>

      <ThemedSection className="bg-white py-12 md:py-20">
        <Container className="max-w-6xl">
          <div className="flex flex-col justify-between gap-8 border border-[#e5e5e5] p-6 sm:p-8 md:flex-row md:items-center md:p-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.24em] text-[#74685f] uppercase">
                Ainda em dúvida?
              </p>
              <h2 className="font-heading mt-3 text-3xl leading-tight tracking-wide uppercase">
                Entre dois tamanhos?
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#655e57]">
                Fale com a equipe e nos conte suas medidas. Podemos ajudar a
                considerar o caimento e a modelagem da peça.
              </p>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                size: "lg",
                className:
                  "min-h-12 shrink-0 gap-2 rounded-full bg-[#231f1b] px-5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#39332d]",
              })}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Falar com a equipe no WhatsApp
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          {/* TODO: confirmar texto final com a loja */}
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-[#74685f]">
            As medidas podem variar conforme a modelagem, o tecido e o caimento
            de cada peça. Texto final a confirmar com a loja.
          </p>
        </Container>
      </ThemedSection>
    </main>
  );
}
