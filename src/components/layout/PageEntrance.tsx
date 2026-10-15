"use client";

import { usePathname } from "next/navigation";
import { type AnimationEvent, type ReactNode, useState } from "react";

type PageEntranceProps = {
  children: ReactNode;
};

export function PageEntrance({ children }: PageEntranceProps) {
  const pathname = usePathname();
  const [finishedPath, setFinishedPath] = useState<string | null>(null);
  const isEntering = finishedPath !== pathname;

  function finishEntrance(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setFinishedPath(pathname);
    }
  }

  return (
    <div
      key={pathname}
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
