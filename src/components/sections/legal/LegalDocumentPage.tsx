import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { Container, ThemedSection } from "@/components/common";
import { routes } from "@/constants/routes";
import type {
  LegalDocument,
  LegalSection,
  LegalSubsection,
} from "@/data/legal";
import { socialLinks } from "@/data/social";

function LegalSectionList({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <ol className="mt-5 space-y-1 p-0">
      {sections.map((section, index) => (
        <li key={section.id} className="!pl-0 before:hidden">
          <a
            href={`#${section.id}`}
            className="group flex min-h-11 items-start gap-3 py-2 text-sm leading-5 text-[#655e57] transition-colors hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6746] motion-reduce:transition-none"
          >
            <span className="shrink-0 pt-0.5 text-xs text-[#8a6746] tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{section.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function LegalBullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex !pl-0 !text-left text-sm leading-7 text-[#39332d] before:hidden sm:text-base"
        >
          <span className="mr-3 shrink-0 text-[#8a6746]" aria-hidden="true">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function LegalSubsectionContent({
  subsection,
}: {
  subsection: LegalSubsection;
}) {
  return (
    <div className="mt-7">
      <h3 className="text-lg leading-snug font-semibold text-[#231f1b] sm:text-xl">
        {subsection.title}
      </h3>
      {subsection.paragraphs?.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-3 !text-left text-sm leading-7 text-[#655e57] sm:text-base"
        >
          {paragraph}
        </p>
      ))}
      {subsection.bullets ? <LegalBullets items={subsection.bullets} /> : null}
    </div>
  );
}

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  const whatsapp = socialLinks.find((link) => link.platform === "whatsapp");

  return (
    <main className="flex flex-1 flex-col">
      <ThemedSection
        className="min-h-[70vh] bg-[#f5f1ea] py-12 text-[#231f1b] sm:py-16 lg:py-20"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <Container className="max-w-7xl px-5 sm:px-7 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <details className="group border-y border-[#231f1b]/15 py-1 lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#231f1b] marker:hidden [&::-webkit-details-marker]:hidden">
                  Sumário
                  <ChevronDown
                    className="size-4 text-[#8a6746] transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <LegalSectionList sections={document.sections} />
              </details>

              <nav
                aria-label="Sumário do documento"
                className="hidden lg:block"
              >
                <h2 className="text-sm font-semibold text-[#231f1b]">
                  Sumário
                </h2>
                <LegalSectionList sections={document.sections} />
              </nav>
            </aside>

            <article className="max-w-4xl min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="mb-8 flex items-center gap-2 text-xs text-[#756d65]"
              >
                <Link
                  href={routes.home}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6746]"
                >
                  Início
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#39332d]">{document.title}</span>
              </nav>

              <header className="mb-10 border-b border-[#231f1b]/15 pb-8 sm:mb-12 sm:pb-10">
                <p className="text-xs font-bold tracking-[0.2em] text-[#8a6746] uppercase">
                  {document.eyebrow}
                </p>
                <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-[#231f1b] sm:text-4xl lg:text-5xl">
                  {document.title} — Essence
                </h1>
                <p className="mt-4 max-w-3xl !text-left text-sm leading-7 text-[#655e57] sm:text-base">
                  {document.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5 text-[#756d65] sm:text-sm">
                  <span>
                    Última atualização:{" "}
                    <time dateTime={document.updatedIso}>
                      {document.updatedAt}
                    </time>
                  </span>
                  <span aria-hidden="true">•</span>
                  <span>Loja Essence · Passos, Minas Gerais</span>
                </div>
              </header>

              <div className="space-y-10 sm:space-y-12">
                {document.sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    aria-labelledby={`${section.id}-title`}
                    className="scroll-mt-28 border-t border-[#231f1b]/10 pt-8 first:border-0 first:pt-0"
                  >
                    <h2
                      id={`${section.id}-title`}
                      className="text-xl leading-snug font-semibold tracking-tight text-[#231f1b] sm:text-2xl"
                    >
                      <span className="mr-2 text-[#8a6746]">{index + 1}.</span>
                      {section.title}
                    </h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-4 !text-left text-sm leading-7 text-[#655e57] sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets ? (
                      <LegalBullets items={section.bullets} />
                    ) : null}
                    {section.subsections?.map((subsection) => (
                      <LegalSubsectionContent
                        key={subsection.title}
                        subsection={subsection}
                      />
                    ))}
                  </section>
                ))}
              </div>

              <div className="mt-12 border-t border-[#231f1b]/15 pt-8 sm:mt-14">
                <h2 className="text-xl font-semibold text-[#231f1b]">
                  Ficou com alguma dúvida?
                </h2>
                <p className="mt-3 !text-left text-sm leading-7 text-[#655e57] sm:text-base">
                  {document.contactPrompt}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={routes.contato}
                    className="inline-flex min-h-11 items-center justify-center bg-[#231f1b] px-5 text-xs font-bold tracking-[0.12em] text-[#f5f1ea] uppercase transition-colors hover:bg-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6746] motion-reduce:transition-none"
                  >
                    Fale com a Essence
                  </Link>
                  {whatsapp ? (
                    <a
                      href={whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center border border-[#231f1b]/30 px-5 text-xs font-semibold tracking-[0.12em] text-[#231f1b] uppercase transition-colors hover:border-[#8a6746] hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6746] motion-reduce:transition-none"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        </Container>
      </ThemedSection>
    </main>
  );
}
