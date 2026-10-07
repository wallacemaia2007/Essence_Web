import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
  robots: { index: false, follow: false },
};

type VerifyCodePageProps = {
  searchParams: Promise<{ email?: string; flow?: string }>;
};

export default async function VerifyCodePage({
  searchParams,
}: VerifyCodePageProps) {
  const params = await searchParams;

  return (
    <AuthExperience
      mode="verify"
      initialEmail={params.email ?? ""}
      initialFlow={params.flow}
    />
  );
}
