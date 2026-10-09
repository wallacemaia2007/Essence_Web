import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ImageBannerButtonVariant = "light" | "dark" | "outline";
type ImageBannerOverlay = "none" | "soft" | "medium" | "strong";
type ImageBannerButtonPosition = "center" | "bottom";

export type ImageBannerProps = {
  /** Caminho da imagem de fundo (ex.: `/images/banners/trends.webp`). */
  imageSrc: string;
  /**
   * Texto alternativo da imagem. Se a arte já tem texto embutido (como nos
   * banners de loja), descreva esse texto aqui. Passe `""` se for decorativa.
   */
  imageAlt: string;
  /** Rótulo do botão central (ex.: "Comprar"). */
  buttonLabel: string;
  /** Destino do botão. Links internos usam `next/link`. */
  href: string;
  /** Texto acessível mais específico para o botão, se o rótulo for genérico. */
  buttonAriaLabel?: string;
  /** Abre o link em outra aba (links externos). */
  external?: boolean;
  /** Estilo do botão: caixa branca, caixa preta ou apenas contorno. */
  buttonVariant?: ImageBannerButtonVariant;
  /** Onde o botão fica sobre a imagem. */
  buttonPosition?: ImageBannerButtonPosition;
  /** Escurece a imagem para dar contraste ao botão/arte. */
  overlay?: ImageBannerOverlay;
  /** Equivale a `object-position` (ex.: "center top", "70% center"). */
  objectPosition?: string;
  /** Marque `true` só para o primeiro banner visível da página (LCP). */
  priority?: boolean;
  /** Dica de tamanho para o `next/image`. Padrão: largura total da tela. */
  sizes?: string;
  /** Classes adicionais para o botão do banner. */
  buttonClassName?: string;
  className?: string;
};

const buttonVariantClasses: Record<ImageBannerButtonVariant, string> = {
  light:
    "bg-white text-black hover:bg-black hover:text-white focus-visible:outline-white",
  dark: "bg-black text-white hover:bg-white hover:text-black focus-visible:outline-black",
  outline:
    "border border-white bg-transparent text-white hover:bg-white hover:text-black focus-visible:outline-white",
};

const overlayClasses: Record<ImageBannerOverlay, string> = {
  none: "bg-transparent",
  soft: "bg-black/15",
  medium: "bg-black/30",
  strong: "bg-black/50",
};

const buttonPositionClasses: Record<ImageBannerButtonPosition, string> = {
  center: "items-center",
  bottom: "items-end pb-8 md:pb-10",
};

/**
 * Banner reutilizável: imagem em largura total ao fundo e um botão
 * personalizado sobre ela. Use quantas vezes quiser, trocando só as props.
 *
 * A altura padrão é `min-h-[22rem] md:min-h-[32rem]`; para mudar, passe outra
 * classe de altura em `className` (ex.: `min-h-[28rem] md:min-h-[40rem]`).
 */
export function ImageBanner({
  buttonAriaLabel,
  buttonClassName,
  buttonLabel,
  buttonPosition = "center",
  buttonVariant = "light",
  className,
  external = false,
  href,
  imageAlt,
  imageSrc,
  objectPosition = "center",
  overlay = "none",
  priority = false,
  sizes = "100vw",
}: ImageBannerProps) {
  return (
    <div
      className={cn(
        "relative isolate flex min-h-[22rem] w-full justify-center overflow-hidden md:min-h-[32rem]",
        buttonPositionClasses[buttonPosition],
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={sizes}
        // Next 16 depreciou `priority`; o hero já usa eager + fetchPriority.
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        style={{ objectPosition }}
        // `.themed-section img` aplica raio e sombra; no banner a imagem é
        // sangrada de ponta a ponta, então os dois são zerados aqui.
        className="-z-20 rounded-none object-cover shadow-none"
      />

      <div
        className={cn("absolute inset-0 -z-10", overlayClasses[overlay])}
        aria-hidden="true"
      />

      <Link
        href={href}
        aria-label={buttonAriaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "font-heading inline-flex h-11 min-w-40 items-center justify-center px-8 text-[0.7rem] font-medium tracking-[0.24em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none",
          buttonVariantClasses[buttonVariant],
          buttonClassName,
        )}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
