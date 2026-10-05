import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SectionCTAProps = {
  href: string;
  label: string;
  className?: string;
};

export function SectionCTA({ className, href, label }: SectionCTAProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "outline" }), className)}
    >
      {label}
      <ArrowRight data-icon="inline-end" aria-hidden="true" />
    </Link>
  );
}
