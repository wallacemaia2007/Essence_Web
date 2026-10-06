import Image from "next/image";

import logoImg from "../../../public/images/logo.png";
import { cn } from "@/lib/utils";

type CrestProps = {
  className?: string;
};

export function Crest({ className }: CrestProps) {
  return (
    <Image
      src={logoImg}
      alt="Essence Web Template"
      className={cn("h-14 w-14 object-contain", className)}
      aria-hidden="true"
      priority={false}
    />
  );
}
