import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata: Metadata = {
  title: "Entrar na sua conta",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthExperience mode="login" />;
}
