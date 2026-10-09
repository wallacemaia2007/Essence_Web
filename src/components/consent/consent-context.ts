"use client";

import { createContext } from "react";

import type {
  ConsentCategories,
  ConsentGateCategory,
  ConsentRecord,
} from "@/lib/consent";

export type ConsentContextValue = {
  hasHydrated: boolean;
  consent: ConsentRecord | null;
  showBanner: boolean;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveChoices: (categories: ConsentCategories) => void;
  allowCategory: (category: ConsentGateCategory) => void;
};

export const ConsentContext = createContext<ConsentContextValue | null>(null);
