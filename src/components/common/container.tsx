import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  "data-mega-open"?: "true" | "false";
};

export function Container({
  children,
  className,
  "data-mega-open": dataMegaOpen,
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4", className)}
      data-mega-open={dataMegaOpen}
    >
      {children}
    </div>
  );
}
