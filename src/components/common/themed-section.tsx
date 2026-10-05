import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface ThemedSectionProps
  extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
}

export const ThemedSection = forwardRef<HTMLElement, ThemedSectionProps>(
  ({ children, className, ...props }, ref) => (
    <section
      ref={ref}
      {...props}
      className={cn("themed-section bg-background text-foreground", className)}
    >
      {children}
    </section>
  ),
);

ThemedSection.displayName = "ThemedSection";