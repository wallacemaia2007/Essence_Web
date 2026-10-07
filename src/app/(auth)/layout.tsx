import type { ReactNode } from "react";

import { AuthLayout } from "@/components/auth/AuthLayout";

type AuthenticationLayoutProps = {
  children: ReactNode;
};

export default function AuthenticationLayout({
  children,
}: AuthenticationLayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
