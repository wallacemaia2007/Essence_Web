"use client";

import { usePathname } from "next/navigation";
import { type AnimationEvent, type ReactNode, useState } from "react";

import { routes } from "@/constants/routes";

type PageEntranceProps = {
  children: ReactNode;
};

const authRoutePrefixes = [
  routes.login,
  routes.register,
  routes.verifyCode,
  routes.resetPassword,
] as const;

function getTransitionKey(pathname: string) {
  const isAuthRoute = authRoutePrefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // AuthLayout animates its own form panel; keep its video mounted between auth routes.
  return isAuthRoute ? "auth" : pathname;
}

export function PageEntrance({ children }: PageEntranceProps) {
  const pathname = usePathname();
  const transitionKey = getTransitionKey(pathname);
  const [finishedPath, setFinishedPath] = useState<string | null>(null);
  const isHomePage = pathname === routes.home;
  const isEntering = !isHomePage && finishedPath !== transitionKey;

  function finishEntrance(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setFinishedPath(transitionKey);
    }
  }

  return (
    <div
      key={transitionKey}
      className={
        isEntering
          ? "page-content-enter flex flex-1 flex-col"
          : "flex flex-1 flex-col"
      }
      onAnimationEnd={finishEntrance}
    >
      {children}
    </div>
  );
}
