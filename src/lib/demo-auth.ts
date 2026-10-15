import {
  DEMO_AUTH_ACCOUNTS_STORAGE_KEY,
  DEMO_AUTH_PENDING_REGISTRATION_STORAGE_KEY,
} from "@/constants/storage";

export const DEMO_ACCOUNT_AVATAR = "/images/avatars/mock-account-avatar.webp";

export type DemoAuthProvider = "email" | "google";

export type DemoAddressLabel = "Casa" | "Trabalho" | "Outro";

export type DemoAddress = {
  id: string;
  label: DemoAddressLabel;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference: string;
  isDefault: boolean;
};

export type DemoAuthUser = {
  name: string;
  email: string;
  avatarUrl: string;
  provider: DemoAuthProvider;
  phone?: string;
  birthDate?: string;
  addresses?: DemoAddress[];
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

  if (
    (account.phone !== undefined && typeof account.phone !== "string") ||
    (account.birthDate !== undefined &&
      typeof account.birthDate !== "string") ||
    (account.addresses !== undefined &&
      (!Array.isArray(account.addresses) ||
        !account.addresses.every(isDemoAddress)))
  ) {
    return null;
  }

  return account;
}

function isDemoAddress(value: unknown): value is DemoAddress {
  if (!value || typeof value !== "object") return false;

  const address = value as Partial<DemoAddress>;
  return (
    typeof address.id === "string" &&
    (address.label === "Casa" ||
      address.label === "Trabalho" ||
      address.label === "Outro") &&
    typeof address.cep === "string" &&
    typeof address.street === "string" &&
    typeof address.number === "string" &&
    typeof address.complement === "string" &&
    typeof address.neighborhood === "string" &&
    typeof address.city === "string" &&
    typeof address.state === "string" &&
    typeof address.reference === "string" &&
    typeof address.isDefault === "boolean"
  );
}

export function saveDemoAccount(user: DemoAuthUser, previousEmail?: string) {
  if (typeof window === "undefined") return false;

  try {
    const accounts = readDemoAccounts();
    const email = normalizeDemoEmail(user.email);
    const previous = previousEmail ? normalizeDemoEmail(previousEmail) : email;
    if (previous !== email) delete accounts[previous];
    accounts[email] = { ...user, email };
    window.localStorage.setItem(
      DEMO_AUTH_ACCOUNTS_STORAGE_KEY,
      JSON.stringify(accounts),
    );
    return true;
  } catch {
    // A demonstração continua funcionando em memória mesmo sem acesso ao storage.
    return false;
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
