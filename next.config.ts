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

  // Arquivos de /public vêm com max-age=0, o que faria o vídeo do hero ser
  // baixado de novo a cada visita. Vídeo e poster recebem cache longo: o nome
  // do arquivo carrega o "conteúdo" (hero-essence.mp4), então só mude ao
  // substituir o arquivo.
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/hero/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.youtube.com" }],
  },
};

export default nextConfig;
