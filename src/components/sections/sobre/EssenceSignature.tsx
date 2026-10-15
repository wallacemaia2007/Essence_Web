import Image from "next/image";

export function EssenceSignature() {
  return (
    <section
      aria-label="Assinatura visual da Essence Passos"
      className="sobre-brand-signature"
    >
      <Image
        alt="Essence Passos"
        className="sobre-brand-signature__logo"
        data-scroll-reveal
        height={225}
        sizes="(min-width: 768px) 180px, 140px"
        src="/images/brand/logo.png"
        width={225}
      />
    </section>
  );
}
