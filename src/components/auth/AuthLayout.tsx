"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

type AuthLayoutProps = {
  children: ReactNode;
};

const transitionEase = [0.22, 1, 0.36, 1] as const;

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <main className="auth-screen relative isolate flex min-h-max flex-1 items-start overflow-x-clip overflow-y-visible bg-white px-4 pt-24 pb-16 text-[#171512] sm:px-6 sm:pt-28 sm:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 -right-32 -z-10 size-[30rem] rounded-full bg-[#f5f1eb] blur-3xl sm:size-[38rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -left-32 -z-10 size-[32rem] rounded-full bg-[#f8f7f4] blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,0.78fr)] lg:gap-16">
        <aside className="relative isolate hidden flex-col justify-end overflow-hidden rounded-[1.8rem] bg-[#211f1d] p-9 text-white shadow-[0_28px_90px_rgba(35,31,27,0.16)] lg:sticky lg:top-24 lg:flex lg:h-[calc(100svh-6rem)] lg:min-h-[38rem]">
          {isDesktop && (
            <video
              aria-hidden="true"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/hero/hero-essence-poster.webp"
              className="auth-visual__video absolute inset-0 z-0 size-full object-cover motion-reduce:hidden"
            >
              <source src="/videos/video_auth.webm" type="video/webm" />
              <source src="/videos/video_auth.mp4" type="video/mp4" />
            </video>
          )}
        </aside>

        <section
          aria-label="Acesso à conta"
          className="w-full max-w-xl justify-self-center lg:justify-self-end"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              layout
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: 22, filter: "blur(6px)" }
              }
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: -14, filter: "blur(4px)" }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.28,
                ease: transitionEase,
              }}
              className="rounded-[1.8rem] border border-[#171512]/10 bg-white/95 p-6 shadow-[0_28px_90px_rgba(35,31,27,0.09)] backdrop-blur sm:p-9"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
