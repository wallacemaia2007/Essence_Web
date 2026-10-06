import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/sections/legal/LegalDocumentPage";
import { routes } from "@/constants/routes";
import { termosDeUso } from "@/data/legal";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Consulte as condições de navegação e uso do site e da vitrine de produtos da Essence.",
  alternates: {
    canonical: routes.termosUso,
  },
  openGraph: {
    title: "Termos de Uso | Essence",
    description: "Condições de acesso, navegação e uso do site da Essence.",
    url: routes.termosUso,
    type: "website",
  },
};

export default function TermosDeUsoPage() {
  return <LegalDocumentPage document={termosDeUso} />;
}
