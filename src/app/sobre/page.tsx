import type { Metadata } from "next";
import Script from "next/script";

import { HomeAbout } from "@/components/sections/home/home-about";
import { PageHeader } from "@/components/sections/sobre/PageHeader";
import { externalLinks, routes } from "@/constants/routes";
import { localizacaoLoja } from "@/data/localizacao";
import { absoluteUrl, ogImage, pages, siteName, siteTagline } from "@/lib/seo";
import { ScrollStory } from "@/components/sections/sobre/ScrollStory";
import { NossaHistoria } from "@/components/sections/sobre/NossaHistoria";
import { ValoresMarca } from "@/components/sections/sobre/ValoresMarca";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/sobre/FinalCta";

const page = pages.sobre;
const socialImage = page.ogImage ?? ogImage;

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    title: page.title,
    description: page.description,
    url: absoluteUrl(page.path),
    siteName,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1920,
        height: 1280,
        alt: "Interior da loja Essence Passos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: page.title,
    description: page.description,
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
      <Script
        id="store-structured-data"
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
