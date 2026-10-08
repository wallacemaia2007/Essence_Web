import Link from "next/link";

import { routes } from "@/constants/routes";

type AccountAreaPlaceholderProps = {
  title: string;
  description: string;
};

export function AccountAreaPlaceholder({
  title,
  description,
}: AccountAreaPlaceholderProps) {
  return (
    <main className="min-h-[65vh] bg-white px-4 pt-32 pb-20 text-[#171717] sm:px-6 sm:pt-40">
      <div className="mx-auto w-full max-w-4xl">
        <p className="m-0 text-[0.65rem] font-semibold tracking-[0.2em] text-black/50 uppercase">
          Área da conta
        </p>
        <h1 className="font-heading mt-4 mb-0 text-4xl font-medium tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-black/65">
          {description}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
          Esta página está reservada para a próxima etapa do projeto. Por
          enquanto, a navegação da conta funciona em modo demonstrativo.
        </p>
        <Link
          href={routes.home}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}
