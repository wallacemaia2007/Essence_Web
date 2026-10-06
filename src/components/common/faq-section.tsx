import { Container } from "@/components/common/container";
import { SectionCTA } from "@/components/common/section-cta";
import { SectionTitle } from "@/components/common/section-title";
import { ThemedSection } from "@/components/common/themed-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { routes } from "@/constants/routes";
import { type FaqGroup, faqGroups as defaultGroups } from "@/data/faq";
import { cn } from "@/lib/utils";

export type FaqSectionProps = {
  /** Grupos de perguntas. Padrão: `faqGroups` em `src/data/faq.ts`. */
  groups?: readonly FaqGroup[];
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Permite abrir várias perguntas de um mesmo grupo ao mesmo tempo. */
  multiple?: boolean;
  /** `id` da pergunta que já nasce aberta. */
  defaultOpenId?: string;
  /** Emite os dados estruturados `FAQPage` (JSON-LD) para o Google. */
  structuredData?: boolean;
  /** Texto e link do convite para quem não achou a resposta. */
  ctaText?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Âncora da seção (`/#faq`). */
  id?: string;
  className?: string;
};

export function FaqSection({
  className,
  ctaHref = routes.contato,
  ctaLabel = "Falar com a equipe",
  ctaText = "Não encontrou o que procurava? Nossa equipe responde o mais rápido possível.",
  defaultOpenId,
  description = "Reunimos as dúvidas mais comuns sobre pedidos, trocas, pagamento e cuidados com as peças.",
  eyebrow = "Ajuda",
  groups = defaultGroups,
  id = "faq",
  multiple = false,
  structuredData = true,
  title = "Perguntas frequentes",
}: FaqSectionProps) {
  const visibleGroups = groups.filter((group) => group.items.length > 0);

  if (visibleGroups.length === 0) {
    return null;
  }

  return (
    <ThemedSection
      id={id}
      aria-label={title}
      className={cn("scroll-mt-24 py-16 md:py-20", className)}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle
              eyebrow={eyebrow}
              title={title}
              description={description}
            />
            <div className="mt-8 max-w-sm">
              <p className="text-muted-foreground text-sm leading-6">
                {ctaText}
              </p>
              <SectionCTA href={ctaHref} label={ctaLabel} className="mt-4" />
            </div>
          </div>

          <div className="space-y-10">
            {visibleGroups.map((group) => {
              const openItem = group.items.find(
                (item) => item.id === defaultOpenId,
              );

              return (
                <div key={group.title}>
                  <h3 className="font-heading text-primary mb-2 text-sm font-semibold tracking-[0.2em] uppercase">
                    {group.title}
                  </h3>
                  <Accordion
                    multiple={multiple}
                    // Deixa a busca do navegador (Ctrl+F) achar e abrir respostas.
                    hiddenUntilFound
                    defaultValue={openItem ? [openItem.id] : []}
                  >
                    {group.items.map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>
                          {item.answer.split("\n\n").map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {structuredData ? <FaqJsonLd groups={visibleGroups} /> : null}
    </ThemedSection>
  );
}

function FaqJsonLd({ groups }: { groups: readonly FaqGroup[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      // `<` escapado para que uma resposta nunca consiga fechar a tag <script>.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
