import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";
import { getSingleSearchParam } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Entrar na sua conta",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthExperience
      mode="login"
      initialRedirectTo={getSingleSearchParam(params.redirectTo)}
    />
  );
}
