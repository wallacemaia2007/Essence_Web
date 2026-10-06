"use client";

import { ArrowUpRight, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";

import { Container, ThemedSection } from "@/components/common";
import { externalLinks } from "@/constants/routes";
import { contato } from "@/data/contato";
import { cn } from "@/lib/utils";

type InstagramReel = {
  id: string;
  caption: string | null;
  permalink: string;
  timestamp: string | null;
  thumbnailUrl: string | null;
};

type InstagramResponse = {
  configured: boolean;
  reels: InstagramReel[];
};

type SocialStatus = "loading" | "ready" | "setup" | "empty" | "error";

type SocialAction = {
  label: string;
  href: string;
  icon: typeof FaInstagram;
  className: string;
};

const facebookUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || externalLinks.facebook;
const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() ||
  `https://wa.me/${contato.whatsapp}`;
const instagramUsername =
  new URL(externalLinks.instagram).pathname.split("/").filter(Boolean)[0] ??
  "instagram";

const socialActions: SocialAction[] = [
  {
    label: "Instagram",
    href: externalLinks.instagram,
    icon: FaInstagram,
    className: "social-feature__action--instagram",
  },
  ...(facebookUrl
    ? [
        {
          label: "Facebook",
          href: facebookUrl,
          icon: FaFacebookF,
          className: "social-feature__action--facebook",
        },
      ]
    : []),
  {
    label: "WhatsApp",
    href: whatsappUrl,
    icon: FaWhatsapp,
    className: "social-feature__action--whatsapp",
  },
];

export function HomeSocial() {
  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [status, setStatus] = useState<SocialStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/instagram/reels", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Instagram indisponível");
        return (await response.json()) as InstagramResponse;
      })
      .then((data) => {
        setReels(data.reels.slice(0, 3));
        setStatus(
          !data.configured
            ? "setup"
            : data.reels.length > 0
              ? "ready"
              : "empty",
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, []);

  return (
    <ThemedSection
      id="redes-sociais"
      aria-labelledby="social-feature-title"
      className="social-feature bg-white py-16 text-[#231f1b] md:py-24"
    >
      <Container className="max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(15rem,0.78fr)_minmax(0,1.8fr)] lg:items-center lg:gap-14">
          <div className="social-feature__intro">
            <div className="social-feature__profile-ring" aria-hidden="true">
              <span className="social-feature__profile-core">
                <Image
                  src="/images/brand/logo.png"
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 object-contain"
                />
              </span>
            </div>
            <p className="social-feature__eyebrow">A Essence no Instagram</p>
            <h2 id="social-feature-title" className="social-feature__title">
              Acompanhe de perto.
            </h2>
            <p className="social-feature__description">
              Novos looks, detalhes e inspirações — direto do nosso dia a dia.
            </p>

            <nav
              aria-label="Redes sociais da Essence"
              className="social-feature__actions"
            >
              {socialActions.map(({ label, href, icon: Icon, className }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("social-feature__action", className)}
                  aria-label={`Abrir ${label} da Essence em uma nova aba`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  <span>{label}</span>
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              ))}
            </nav>
          </div>

          <div className="min-w-0">
            <div className="social-feature__gallery-heading">
              <div>
                <p className="social-feature__gallery-label">Reels recentes</p>
                <p className="social-feature__handle">@{instagramUsername}</p>
              </div>
              <a
                href={externalLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-feature__all-link"
              >
                Ver perfil{" "}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </div>

            {status === "ready" ? (
              <div
                className="social-feature__reels"
                aria-label="Três Reels mais recentes"
              >
                {reels.map((reel, index) => (
                  <ReelCard key={reel.id} reel={reel} index={index} />
                ))}
              </div>
            ) : status === "loading" ? (
              <div
                className="social-feature__reels"
                aria-label="Carregando Reels"
              >
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="social-feature__skeleton"
                    aria-hidden="true"
                  />
                ))}
              </div>
            ) : (
              <div className="social-feature__empty">
                <FaInstagram aria-hidden="true" className="size-7" />
                <p className="social-feature__empty-title">
                  {status === "setup"
                    ? "Conecte o Instagram da Essence."
                    : status === "empty"
                      ? "As novidades passam por aqui."
                      : "Não foi possível carregar os Reels agora."}
                </p>
                <p className="social-feature__empty-copy">
                  {status === "setup"
                    ? "Os três Reels mais recentes aparecerão automaticamente quando a conexão da conta estiver configurada."
                    : status === "empty"
                      ? "Acompanhe os próximos Reels e publicações da loja."
                      : "Tente novamente mais tarde ou veja as publicações diretamente no Instagram."}
                </p>
                {status === "setup" &&
                  process.env.NODE_ENV === "development" && (
                    <p className="social-feature__setup-hint">
                      Configure <code>INSTAGRAM_USER_ID</code> e{" "}
                      <code>INSTAGRAM_ACCESS_TOKEN</code> no arquivo{" "}
                      <code>.env.local</code> do servidor.
                    </p>
                  )}
                <a
                  href={externalLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-feature__empty-link"
                >
                  Abrir Instagram{" "}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </Container>
    </ThemedSection>
  );
}

function ReelCard({ reel, index }: { reel: InstagramReel; index: number }) {
  const caption = reel.caption?.replace(/\s+/g, " ").trim();
  const label = caption || `Reel recente da Essence — ${index + 1}`;
  const date = reel.timestamp
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
        new Date(reel.timestamp),
      )
    : null;

  return (
    <a
      href={reel.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="social-feature__reel-shell"
      aria-label={`Assistir no Instagram: ${label}`}
    >
      <article className="social-feature__reel">
        {reel.thumbnailUrl ? (
          <Image
            src={reel.thumbnailUrl}
            alt={label}
            fill
            unoptimized
            sizes="(min-width: 768px) 22vw, 72vw"
            className="social-feature__reel-image"
          />
        ) : (
          <div className="social-feature__reel-fallback" aria-hidden="true">
            <FaInstagram className="size-10" />
          </div>
        )}
        <div className="social-feature__reel-shade" aria-hidden="true" />
        <span className="social-feature__reel-badge">
          <Play aria-hidden="true" className="size-3 fill-current" /> Reel
        </span>
        <span className="social-feature__reel-open" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
        <div className="social-feature__reel-caption">
          <p>{caption || "Um detalhe do nosso universo."}</p>
          {date && <time dateTime={reel.timestamp ?? undefined}>{date}</time>}
        </div>
      </article>
    </a>
  );
}
