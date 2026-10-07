import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata: Metadata = {
  title: "Criar nova senha",
  robots: { index: false, follow: false },
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return <AuthExperience mode="reset" initialEmail={params.email ?? ""} />;
}
