import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";

export function FinalCta() {
  return (
    <section aria-labelledby="sobre-cta-title" className="sobre-final-cta">
      <Container className="sobre-final-cta__inner">
        <div data-scroll-reveal>
          <p className="sobre-section__eyebrow">A sua próxima descoberta</p>
          <h2 className="sobre-final-cta__title" id="sobre-cta-title">
            Encontre o que combina consigo.
          </h2>
        </div>
        <Button
          className="sobre-final-cta__button"
          data-scroll-reveal
          data-scroll-reveal-delay="0.12"
          nativeButton={false}
          role="link"
          render={<Link href={routes.colecao} />}
          size="lg"
        >
          Explorar a vitrine
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Button>
      </Container>
    </section>
  );
}
