import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { Crest } from "@/components/common/crest";
import { ThemedSection } from "@/components/common/themed-section";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({
  children,
  description,
  eyebrow,
  title,
}: PageHeroProps) {
  return (
    <ThemedSection className="border-b py-16 md:py-20">
      <Container>
        <div className="text-primary mb-4">
          <Crest className="h-12 w-12" />
        </div>
        {eyebrow ? (
          <p className="text-primary text-xs font-semibold tracking-[0.26em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading mt-3 max-w-4xl text-4xl leading-tight uppercase md:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-3xl text-lg">
          {description}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </ThemedSection>
  );
}
