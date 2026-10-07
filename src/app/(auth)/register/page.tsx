import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <AuthExperience mode="register" />;
}
