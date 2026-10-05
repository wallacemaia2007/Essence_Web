import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.107"],

  // ⚡ CRÍTICO: HMR mais rápido e otimizações de build
  experimental: {
    // Compilação incremental otimizada para bibliotecas pesadas
    // O optimizePackageImports faz tree-shaking automático no Turbopack/Webpack
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
      "gsap",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
      "sonner",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
    ],
  },

  // 🚀 Otimizações de compilação
  compiler: {
    // Remove console.log em produção
    removeConsole: process.env.NODE_ENV === "production",
  },

  async redirects() {
    return [{ source: "/palestras", destination: "/midia", permanent: true }];
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.youtube.com" }],
  },
};

export default nextConfig;
