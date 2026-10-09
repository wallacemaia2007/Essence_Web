import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";
import { getSingleSearchParam } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

type RegisterPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  return (
    <AuthExperience
      mode="register"
      initialRedirectTo={getSingleSearchParam(params.redirectTo)}
    />
  );
}
