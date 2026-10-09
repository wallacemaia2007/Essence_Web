"use client";

import type { ReactNode } from "react";

import { useConsent } from "@/hooks/useConsent";

const defaultClassName =
  "inline-flex min-h-11 items-center rounded-sm text-sm text-[#171717] underline underline-offset-4 transition-colors hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]";

type CookiePreferencesButtonProps = {
  children?: ReactNode;
  className?: string;
};

export function CookiePreferencesButton({
  children = "Preferências de cookies",
  className = defaultClassName,
}: CookiePreferencesButtonProps) {
  const { openPreferences } = useConsent();

  return (
    <button type="button" onClick={openPreferences} className={className}>
      {children}
    </button>
  );
}
