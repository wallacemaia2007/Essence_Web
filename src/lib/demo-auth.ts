import {
  DEMO_AUTH_ACCOUNTS_STORAGE_KEY,
  DEMO_AUTH_PENDING_REGISTRATION_STORAGE_KEY,
} from "@/constants/storage";

export const DEMO_ACCOUNT_AVATAR = "/images/avatars/mock-account-avatar.webp";

export type DemoAuthProvider = "email" | "google";

export type DemoAuthUser = {
  name: string;
  email: string;
  avatarUrl: string;
  provider: DemoAuthProvider;
};

type PendingRegistration = {
  name: string;
  email: string;
};

export function normalizeDemoEmail(email: string) {
  return email.trim().toLowerCase();
}

function nameFromEmail(email: string) {
  const localPart = normalizeDemoEmail(email).split("@")[0] ?? "";
  const words = localPart
    .replace(/[._+-]+/g, " ")
    .replace(/\d+/g, " ")
    .trim();
  const name = words
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1))
    .join(" ");

  return name || "Cliente Essence";
}

export function createDemoAuthUser(
  email: string,
  name?: string,
  provider: DemoAuthProvider = "email",
): DemoAuthUser {
  return {
    name: name?.trim() || nameFromEmail(email),
    email: normalizeDemoEmail(email),
    avatarUrl: DEMO_ACCOUNT_AVATAR,
    provider,
  };
}

function readDemoAccounts(): Record<string, DemoAuthUser> {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(DEMO_AUTH_ACCOUNTS_STORAGE_KEY);
    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Record<string, DemoAuthUser>;
  } catch {
    return {};
  }
}

export function getDemoAccount(email: string) {
  const normalizedEmail = normalizeDemoEmail(email);
  const account = readDemoAccounts()[normalizedEmail];

  if (
    !account ||
    typeof account.name !== "string" ||
    typeof account.email !== "string" ||
    typeof account.avatarUrl !== "string" ||
    (account.provider !== "email" && account.provider !== "google")
  ) {
    return null;
  }

  return account;
}

export function saveDemoAccount(user: DemoAuthUser) {
  if (typeof window === "undefined") return;

  try {
    const accounts = readDemoAccounts();
    accounts[normalizeDemoEmail(user.email)] = user;
    window.localStorage.setItem(
      DEMO_AUTH_ACCOUNTS_STORAGE_KEY,
      JSON.stringify(accounts),
    );
  } catch {
    // A demonstração continua funcionando em memória mesmo sem acesso ao storage.
  }
}

export function savePendingDemoRegistration(email: string, name: string) {
  if (typeof window === "undefined") return;

  const normalizedEmail = normalizeDemoEmail(email);
  const pending: PendingRegistration = {
    email: normalizedEmail,
    name: name.trim(),
  };

  try {
    window.sessionStorage.setItem(
      `${DEMO_AUTH_PENDING_REGISTRATION_STORAGE_KEY}:${normalizedEmail}`,
      JSON.stringify(pending),
    );
  } catch {
    // O fluxo pode prosseguir sem persistência temporária.
  }
}

export function readPendingDemoRegistration(email: string) {
  if (typeof window === "undefined") return null;

  const normalizedEmail = normalizeDemoEmail(email);

  try {
    const stored = window.sessionStorage.getItem(
      `${DEMO_AUTH_PENDING_REGISTRATION_STORAGE_KEY}:${normalizedEmail}`,
    );
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("email" in parsed) ||
      !("name" in parsed) ||
      parsed.email !== normalizedEmail ||
      typeof parsed.name !== "string"
    ) {
      return null;
    }

    return parsed as PendingRegistration;
  } catch {
    return null;
  }
}

export function clearPendingDemoRegistration(email: string) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(
      `${DEMO_AUTH_PENDING_REGISTRATION_STORAGE_KEY}:${normalizeDemoEmail(email)}`,
    );
  } catch {
    // Ignora falhas de storage; não há dado sensível nesta chave temporária.
  }
}
