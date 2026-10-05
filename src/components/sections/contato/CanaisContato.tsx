import { CheckCircle2, ExternalLink, Mail, MessageCircle } from "lucide-react";

import { SocialLinks } from "@/components/common";
import { contato } from "@/data/contato";
import { socialLinks } from "@/data/social";
import { buildGmailComposeUrl } from "@/lib/gmail";

export function CanaisContato() {
  const whatsappHref = contato.whatsapp
    ? `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(
        "Olá, vim pelo site e gostaria de conversar.",
      )}`
    : null;

  return (
    <aside className="space-y-6 lg:max-w-[35rem]">
      <div className="bg-card rounded-lg border p-5 shadow-sm md:p-6">
        <h2 className="text-2xl leading-tight font-semibold">Contato rápido</h2>
        <div className="mt-5 space-y-3">
          <QuickContactLink
            href={buildGmailComposeUrl({ to: contato.email })}
            icon={<Mail />}
            external
          >
            Enviar Email Diretamente
          </QuickContactLink>

          {whatsappHref ? (
            <QuickContactLink
              href={whatsappHref}
              icon={<MessageCircle />}
              external
            >
              WhatsApp
            </QuickContactLink>
          ) : (
            <QuickContactLink
              href={contato.institutoMotiro}
              icon={<ExternalLink />}
              external
            >
              Instituto Motirõ
            </QuickContactLink>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border p-5 shadow-sm md:p-6">
        <h2 className="text-2xl leading-tight font-semibold">Redes sociais</h2>
        <p className="text-muted-foreground mt-4 text-sm leading-6">
          Conecte-se comigo nas redes sociais para acompanhar meu trabalho e
          novidades:
        </p>
        <SocialLinks
          links={socialLinks}
          className="mt-5 justify-center gap-3 [&_a]:size-10 [&_a]:rounded-md"
        />
      </div>

      <div className="bg-card rounded-lg border p-5 shadow-sm md:p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-primary size-5" aria-hidden="true" />
          <h2 className="text-xl leading-tight font-semibold">
            Disponível para projetos
          </h2>
        </div>
        <p className="text-muted-foreground mt-4 text-sm leading-6">
          Atualmente aceitando novos projetos e oportunidades de colaboração.
          Respondo normalmente em até 24 horas.
        </p>
      </div>
    </aside>
  );
}

type QuickContactLinkProps = {
  href: string;
  icon: React.ReactNode;
  external?: boolean;
  children: React.ReactNode;
};

function QuickContactLink({
  children,
  external,
  href,
  icon,
}: QuickContactLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="border-border hover:border-primary hover:text-primary focus-visible:ring-ring/50 flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-center text-sm font-medium transition focus-visible:ring-3 focus-visible:outline-none [&_svg]:size-4"
    >
      {icon}
      {children}
    </a>
  );
}
