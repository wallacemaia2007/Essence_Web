"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useDemoAuth } from "@/components/auth/DemoAuthProvider";
import { routes } from "@/constants/routes";

function ProtectedAreaSkeleton() {
  return (
    <div className="min-h-[24rem] py-6" aria-busy="true">
      <p role="status" className="sr-only">
        Verificando sua sessão…
      </p>
      <div aria-hidden="true" className="animate-pulse space-y-5">
        <div className="h-8 w-52 rounded-lg bg-black/5" />
        <div className="h-28 rounded-2xl bg-black/5" />
        <div className="h-40 rounded-2xl bg-black/5" />
      </div>
    </div>
  );
}

export function ProtectedArea({ children }: { children: ReactNode }) {
  const { user, ready } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready || user) return;

    const returnPath = `${window.location.pathname}${window.location.search}`;
    const params = new URLSearchParams({ redirectTo: returnPath });
    router.replace(`${routes.login}?${params.toString()}`);
  }, [ready, router, user]);

  if (!ready || !user) return <ProtectedAreaSkeleton />;

  return <>{children}</>;
}
