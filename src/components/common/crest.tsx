import Image from "next/image";

import { cn } from "@/lib/utils";

import logoImg from "../../../public/images/logo.png";

type CrestProps = {
  className?: string;
};

export function Crest({ className }: CrestProps) {
  return (
    <Image
      src={logoImg}
      alt="Essence"
      className={cn("h-14 w-14 object-contain", className)}
      aria-hidden="true"
      priority={false}
    />
  );
}
