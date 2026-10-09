import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";
import { getSingleSearchParam } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
  robots: { index: false, follow: false },
};

type VerifyCodePageProps = {
  searchParams: Promise<{
    email?: string | string[];
    flow?: string | string[];
    redirectTo?: string | string[];
  }>;
};

export default async function VerifyCodePage({
  searchParams,
}: VerifyCodePageProps) {
  const params = await searchParams;

  return (
    <AuthExperience
      mode="verify"
      initialEmail={getSingleSearchParam(params.email) ?? ""}
      initialFlow={getSingleSearchParam(params.flow)}
      initialRedirectTo={getSingleSearchParam(params.redirectTo)}
    />
  );
}
