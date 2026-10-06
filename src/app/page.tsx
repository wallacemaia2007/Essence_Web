import { FaqSection, ImageBanner, ThemedSection } from "@/components/common";
import { HomeAbout } from "@/components/sections/home/home-about";
import { HomeConjuntos } from "@/components/sections/home/home-conjuntos";
import { HomeHero } from "@/components/sections/home/home-hero";
import { HomeNovidades } from "@/components/sections/home/home-novidades";
import { HomeSocial } from "@/components/sections/home/home-social";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HomeHero />
      <HomeNovidades />
      <HomeSocial />
      <HomeConjuntos />
      <HomeAbout />
      <ImageBanner
        imageSrc="/images/hero/hero-essence-poster.webp"
        imageAlt=""
        buttonLabel="Contato"
        buttonAriaLabel="Ir para a página de contato"
        href="/contato"
        buttonVariant="light"
        buttonPosition="bottom"
        overlay="soft"
        objectPosition="center"
      />
      <FaqSection />
      <ThemedSection className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-heading text-3xl tracking-wide uppercase md:text-4xl">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Clone este template, personalize os dados em{" "}
            <code className="bg-muted rounded px-1.5 font-mono">src/data/</code>{" "}
            e
            <code className="bg-muted rounded px-1.5 font-mono">
              src/lib/seo.ts
            </code>
            , e comece a desenvolver.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-lg px-6 text-sm font-semibold transition"
            >
              Ver no GitHub
            </a>
            <a
              href="/contato"
              className="border-border bg-background hover:bg-muted h-11 rounded-lg border px-6 text-sm font-semibold transition"
            >
              Contato
            </a>
          </div>
        </div>
      </ThemedSection>
    </main>
  );
}
