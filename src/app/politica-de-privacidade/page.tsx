import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/sections/legal/LegalDocumentPage";
import { routes } from "@/constants/routes";
import { politicaPrivacidade } from "@/data/legal";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como a Essence trata informações relacionadas à navegação e aos contatos realizados pelo site.",
  alternates: {
    canonical: routes.politicaPrivacidade,
  },
  openGraph: {
    title: "Política de Privacidade | Essence",
    description:
      "Informações sobre privacidade e proteção de dados no site da Essence.",
    url: routes.politicaPrivacidade,
    type: "website",
  },
};

export default function PoliticaDePrivacidadePage() {
  return <LegalDocumentPage document={politicaPrivacidade} />;
}
