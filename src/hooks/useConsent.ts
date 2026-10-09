"use client";

import { useContext } from "react";

import { ConsentContext } from "@/components/consent/consent-context";

export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error("useConsent precisa ser usado dentro de ConsentProvider.");
  }

  return context;
}
