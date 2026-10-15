import "./globals.css";
import "./globals.scss";

import type { Metadata } from "next";
import { Bodoni_Moda, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/Header";
import { PageEntrance } from "@/components/layout/PageEntrance";
import { Providers } from "@/components/providers";
import { baseUrl, ogImage, pages, siteDescription, siteName } from "@/lib/seo";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: pages.home.title,
    template: "%s | Essence",
  },
  description: siteDescription,
  alternates: { canonical: pages.home.path },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: pages.home.title,
    description: siteDescription,
    url: pages.home.path,
    siteName,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1920,
        height: 1280,
        alt: "Interior da loja Essence Passos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pages.home.title,
    description: siteDescription,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${bodoniModa.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: baseUrl.toString(),
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${baseUrl.toString()}?s={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <div id="site-content" className="flex flex-1 flex-col">
            <PageEntrance>{children}</PageEntrance>
          </div>
          <div id="site-footer">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
