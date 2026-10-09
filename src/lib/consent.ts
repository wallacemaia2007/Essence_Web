export const CONSENT_STORAGE_KEY = "essence_consent";
export const CONSENT_POLICY_VERSION = "2026-10-09-v1";

export const consentCategories = [
  "necessary",
  "preferences",
  "statistics",
  "marketing",
] as const;

export type ConsentCategory = (typeof consentCategories)[number];
export type OptionalConsentCategory = Exclude<ConsentCategory, "necessary">;
export type ConsentGateCategory = ConsentCategory | "analytics";

export type ConsentCategories = Record<ConsentCategory, boolean>;

export type ConsentRecord = {
  policyVersion: string;
  date: string;
  categories: ConsentCategories;
};

export function initialConsentCategories(): ConsentCategories {
  return {
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  };
}

export function normalizeConsentCategory(
  category: ConsentGateCategory,
): ConsentCategory {
  return category === "analytics" ? "statistics" : category;
}

export function createConsentRecord(
  categories: ConsentCategories,
): ConsentRecord {
  return {
    policyVersion: CONSENT_POLICY_VERSION,
    date: new Date().toISOString(),
    categories: {
      necessary: true,
      preferences: Boolean(categories.preferences),
      statistics: Boolean(categories.statistics),
      marketing: Boolean(categories.marketing),
    },
  };
}

export function readStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const candidate = parsed as Partial<ConsentRecord>;
    const categories = candidate.categories;

    if (
      candidate.policyVersion !== CONSENT_POLICY_VERSION ||
      typeof candidate.date !== "string" ||
      !Number.isFinite(Date.parse(candidate.date)) ||
      !categories ||
      typeof categories !== "object" ||
      typeof categories.preferences !== "boolean" ||
      typeof categories.statistics !== "boolean" ||
      typeof categories.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      policyVersion: CONSENT_POLICY_VERSION,
      date: candidate.date,
      categories: {
        necessary: true,
        preferences: categories.preferences,
        statistics: categories.statistics,
        marketing: categories.marketing,
      },
    };
  } catch {
    return null;
  }
}
