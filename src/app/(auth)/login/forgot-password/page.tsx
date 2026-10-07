import type { Metadata } from "next";

import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <AuthExperience mode="forgot" />;
}
