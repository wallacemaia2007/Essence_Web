"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

import { DEMO_AUTH_SESSION_STORAGE_KEY } from "@/constants/storage";
import type { DemoAuthUser } from "@/lib/demo-auth";

type DemoAuthContextValue = {
  user: DemoAuthUser | null;
  ready: boolean;
  signIn: (user: DemoAuthUser) => void;
  signOut: () => void;
};

const DEMO_AUTH_CHANGE_EVENT = "essence:demo-auth-change";
let memorySession = "";

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

function parseDemoUser(value: string | null): DemoAuthUser | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;

    const user = parsed as Partial<DemoAuthUser>;
    if (
      typeof user.name !== "string" ||
      typeof user.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(user.email) ||
      typeof user.avatarUrl !== "string" ||
      (user.provider !== "email" && user.provider !== "google")
    ) {
      return null;
    }

    return user as DemoAuthUser;
  } catch {
    return null;
  }
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(DEMO_AUTH_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(DEMO_AUTH_CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  try {
    return (
      window.localStorage.getItem(DEMO_AUTH_SESSION_STORAGE_KEY) ??
      memorySession
    );
  } catch {
    return memorySession;
  }
}

function getServerSnapshot() {
  return null;
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const sessionSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const user = parseDemoUser(sessionSnapshot);
  const ready = sessionSnapshot !== null;

  const signIn = useCallback((nextUser: DemoAuthUser) => {
    const serialized = JSON.stringify(nextUser);
    memorySession = serialized;

    try {
      window.localStorage.setItem(DEMO_AUTH_SESSION_STORAGE_KEY, serialized);
    } catch {
      // A sessão segue ativa em memória durante esta visita.
    }

    window.dispatchEvent(new Event(DEMO_AUTH_CHANGE_EVENT));
  }, []);

  const signOut = useCallback(() => {
    memorySession = "";

    try {
      window.localStorage.removeItem(DEMO_AUTH_SESSION_STORAGE_KEY);
    } catch {
      // O estado local é encerrado mesmo se o navegador bloquear o storage.
    }

    window.dispatchEvent(new Event(DEMO_AUTH_CHANGE_EVENT));
  }, []);

  return (
    <DemoAuthContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error("useDemoAuth precisa estar dentro de DemoAuthProvider.");
  }
  return context;
}
