import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";

import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/sobre/FinalCta";
import { NossaHistoria } from "@/components/sections/sobre/NossaHistoria";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { ScrollStory } from "@/components/sections/sobre/ScrollStory";
import { ValoresMarca } from "@/components/sections/sobre/ValoresMarca";
import { externalLinks, routes } from "@/constants/routes";
import { localizacaoLoja } from "@/data/localizacao";
import { absoluteUrl } from "@/lib/seo";

const pageTitle = "Sobre a Essence | Moda feminina em Passos";
const pageDescription =
  "Conheça a Essence Passos: uma curadoria de moda feminina, atendimento próximo e uma experiência pensada para descobrir peças com a sua cara.";
const socialImage = "/images/conjuntos/hero-conjuntos-essence.webp";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: routes.sobre },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl(routes.sobre),
    siteName: "Essence Passos",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 2688,
        height: 1152,
        alt: "Editorial de moda feminina da Essence Passos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [socialImage],
  },
};

const storeStructuredData = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Essence Passos",
  url: absoluteUrl("/"),
  image: absoluteUrl(socialImage),
  address: {
    "@type": "PostalAddress",
    streetAddress: localizacaoLoja.endereco[0],
    addressLocality: localizacaoLoja.cidade,
    addressRegion: localizacaoLoja.estado,
    addressCountry: "BR",
  },
  openingHours: localizacaoLoja.openingHoursSchema,
  sameAs: [externalLinks.instagram],
  geo: {
    "@type": "GeoCoordinates",
    latitude: localizacaoLoja.geo.latitude,
    longitude: localizacaoLoja.geo.longitude,
  },
};

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <main className="sobre-page flex flex-1 flex-col">
        <ScrollStory />
        <NossaHistoria />
        <ValoresMarca />
        <Testimonials />
        <FinalCta />
      </main>
    </>
  );
}
