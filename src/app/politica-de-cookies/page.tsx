import type { Metadata } from "next";
import Link from "next/link";

import { Container, ThemedSection } from "@/components/common";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { cookieInventory } from "@/data/cookies";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Entenda como a Essence usa cookies e tecnologias semelhantes e escolha suas preferências de consentimento.",
  alternates: { canonical: routes.politicaCookies },
  openGraph: {
    title: "Política de Cookies | Essence",
    description:
      "Informações sobre cookies, tecnologias semelhantes e preferências de consentimento da Essence.",
    url: routes.politicaCookies,
    type: "website",
  },
};

const categories = [
  {
    title: "Necessários",
    description:
      "Apoiam funções solicitadas, segurança e o registro das escolhas de consentimento. Permanecem sempre ativos.",
  },
  {
    title: "Preferências",
    description:
      "Guardam ou carregam recursos que tornam a experiência mais adequada, como o mapa incorporado da loja.",
  },
  {
    title: "Estatísticas",
    description:
      "Podem medir o uso do site. Recursos desta categoria só devem ser ativados depois de uma escolha afirmativa.",
  },
  {
    title: "Marketing",
    description:
      "Podem carregar conteúdo e mídia de redes sociais, como os Reels e miniaturas do Instagram.",
  },
] as const;

const whatsappHref = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre a Política de Cookies da Essence.")}`;

export default function PoliticaDeCookiesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        currentPage="Política de Cookies"
        title="Política de Cookies"
        description="Saiba como cookies e tecnologias semelhantes podem apoiar o funcionamento do site e como revisar suas escolhas."
      />

      <ThemedSection className="bg-white py-12 text-[#171717] sm:py-16">
        <Container className="max-w-6xl">
          <div className="space-y-12">
            <section aria-labelledby="cookies-o-que-sao">
              <h2
                id="cookies-o-que-sao"
                className="font-heading text-2xl leading-tight tracking-wide uppercase sm:text-3xl"
              >
                O que são cookies e tecnologias semelhantes?
              </h2>
              <p className="mt-4 max-w-4xl text-sm leading-7 text-[#655e57] sm:text-base">
                Cookies são pequenos arquivos gravados pelo navegador. O site
                também pode usar armazenamento local ou de sessão e carregar
                conteúdo de outros provedores. A lista abaixo é um inventário
                inicial dos recursos encontrados no código e dos pontos que
                precisam ser confirmados com a loja e com os fornecedores em
                produção. Nomes e prazos de tecnologias externas podem variar
                conforme a configuração do serviço.
              </p>
            </section>

            <section aria-labelledby="cookies-categorias">
              <h2
                id="cookies-categorias"
                className="font-heading text-2xl leading-tight tracking-wide uppercase sm:text-3xl"
              >
                Categorias de consentimento
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {categories.map((category) => (
                  <article
                    key={category.title}
                    className="border border-black/10 bg-white p-5 sm:p-6"
                  >
                    <h3 className="text-base font-semibold">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#655e57]">
                      {category.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="cookies-inventario">
              <h2
                id="cookies-inventario"
                className="font-heading text-2xl leading-tight tracking-wide uppercase sm:text-3xl"
              >
                Inventário inicial
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#655e57]">
                Armazenamentos do navegador e conteúdo externo estão identificados
                na coluna “Nome”. A equipe deve validar esta relação contra a
                configuração de produção, hospedagem, ferramentas habilitadas e
                avisos atuais de cada provedor.
              </p>
              <div className="mt-5 overflow-x-auto border border-black/10">
                <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Nome, finalidade, categoria e duração de cookies e tecnologias semelhantes
                  </caption>
                  <thead className="bg-[#f7f7f7] text-xs tracking-[0.12em] text-[#655e57] uppercase">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Nome
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Finalidade
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Categoria
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Duração
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {cookieInventory.map((item) => (
                      <tr key={item.name} className="transition-colors hover:bg-[#fafafa]">
                        <th
                          scope="row"
                          className="max-w-64 px-4 py-4 align-top font-medium text-[#171717]"
                        >
                          {item.name}
                        </th>
                        <td className="max-w-md px-4 py-4 align-top leading-6 text-[#655e57]">
                          {item.purpose}
                        </td>
                        <td className="px-4 py-4 align-top text-[#171717]">
                          {item.category}
                        </td>
                        <td className="max-w-64 px-4 py-4 align-top leading-6 text-[#655e57]">
                          {item.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="cookies-escolhas">
              <h2
                id="cookies-escolhas"
                className="font-heading text-2xl leading-tight tracking-wide uppercase sm:text-3xl"
              >
                Como mudar sua escolha
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#655e57]">
                Use o botão abaixo para abrir novamente o painel de preferências.
                Você também pode apagar cookies e dados locais pelas opções do
                navegador; isso pode encerrar sessões demonstrativas ou remover
                itens guardados na sacola e nos favoritos.
              </p>
              <CookiePreferencesButton className="mt-4 inline-flex min-h-12 items-center justify-center bg-[#171717] px-5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]">
                Abrir preferências de cookies
              </CookiePreferencesButton>
            </section>

            <section
              aria-labelledby="cookies-contato"
              className="border-t border-black/10 pt-8"
            >
              <h2
                id="cookies-contato"
                className="font-heading text-2xl leading-tight tracking-wide uppercase sm:text-3xl"
              >
                Dúvidas ou contato
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#655e57]">
                Para dúvidas sobre esta política ou sobre suas escolhas, fale com
                a equipe da Essence pelo WhatsApp ou consulte a Política de
                Privacidade.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center border border-[#171717] px-5 text-xs font-semibold tracking-[0.1em] text-[#171717] uppercase transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  Falar com a loja
                </a>
                <Link
                  href={routes.politicaPrivacidade}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-[#171717] underline underline-offset-4 hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  Política de Privacidade
                </Link>
              </div>
            </section>
          </div>
        </Container>
      </ThemedSection>
    </main>
  );
}
