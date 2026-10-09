"use client";

import type { ReactNode } from "react";

import { useConsent } from "@/hooks/useConsent";
import {
  type ConsentGateCategory,
  normalizeConsentCategory,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

type ConsentGateProps = {
  category: ConsentGateCategory;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

const categoryLabels = {
  necessary: "necessários",
  preferences: "preferências",
  statistics: "estatísticas",
  marketing: "marketing",
} as const;

export function ConsentGate({
  category,
  children,
  title = "Conteúdo externo",
  description,
  className,
}: ConsentGateProps) {
  const { allowCategory, consent, hasHydrated } = useConsent();
  const normalizedCategory = normalizeConsentCategory(category);
  const allowed =
    normalizedCategory === "necessary" ||
    Boolean(consent?.categories[normalizedCategory]);

  if (hasHydrated && allowed) return <>{children}</>;

  const categoryLabel = categoryLabels[normalizedCategory];

  return (
    <div
      role="region"
      aria-label={`${title}; consentimento de ${categoryLabel} necessário`}
      className={cn(
        "flex min-h-56 w-full flex-col items-center justify-center gap-3 bg-[#f7f7f7] p-6 text-center text-[#171717]",
        className,
      )}
    >
      <p className="font-heading text-lg font-medium">{title}</p>
      <p className="max-w-md text-sm leading-6 text-[#655e57]">
        {description ??
          `Este conteúdo só é carregado após a autorização da categoria ${categoryLabel}.`}
      </p>
      {hasHydrated ? (
        <button
          type="button"
          onClick={() => allowCategory(category)}
          className="mt-1 inline-flex min-h-11 items-center justify-center border border-[#171717] bg-white px-5 text-xs font-semibold tracking-[0.12em] text-[#171717] uppercase transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] motion-reduce:transition-none"
        >
          Permitir e carregar
        </button>
      ) : (
        <span role="status" className="text-xs text-[#655e57]">
          Carregando preferências…
        </span>
      )}
    </div>
  );
}
