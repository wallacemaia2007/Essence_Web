"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { type ReactNode, useState } from "react";
import { Toaster } from "sonner";

import { DemoAuthProvider } from "@/components/auth/DemoAuthProvider";
import { SmoothScrollProvider } from "@/components/common";
import { ConsentProvider } from "@/components/consent/ConsentProvider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ConsentProvider>
          <DemoAuthProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </DemoAuthProvider>
          <Toaster richColors closeButton />
        </ConsentProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
