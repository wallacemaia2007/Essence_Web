import { FaqSection, ImageBanner, ThemedSection } from "@/components/common";
import { HomeAbout } from "@/components/sections/home/home-about";
import { HomeConjuntos } from "@/components/sections/home/home-conjuntos";
import { HomeHero } from "@/components/sections/home/home-hero";
import { HomeLocation } from "@/components/sections/home/home-location";
import { HomeNovidades } from "@/components/sections/home/home-novidades";
import { HomeSocial } from "@/components/sections/home/home-social";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HomeHero />
      <HomeNovidades />
      <HomeConjuntos />
      <HomeSocial />
      <HomeAbout />
      <HomeLocation />
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
    </main>
  );
}
