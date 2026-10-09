import type { Metadata } from "next";

import { CatalogoProdutos } from "@/components/sections/catalogo/CatalogoProdutos";
import { routes } from "@/constants/routes";

const description =
  "Explore as peças em promoção no Outlet da Essence Passos. Ofertas demonstrativas, sujeitas à confirmação da loja.";

export const metadata: Metadata = {
  title: "Outlet",
  description,
  alternates: { canonical: routes.outlet },
  openGraph: {
    title: "Outlet | Essence",
    description,
    url: routes.outlet,
    type: "website",
  },
};

export default function OutletPage() {
  return (
    <main className="flex flex-1 flex-col">
      <CatalogoProdutos modo="outlet" />
    </main>
  );
}
