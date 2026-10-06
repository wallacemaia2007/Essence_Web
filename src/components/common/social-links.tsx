import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaSpotify,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

import { cn } from "@/lib/utils";
import type { SocialLink, SocialPlatform } from "@/types/portfolio";

type SocialLinksProps = {
  links: SocialLink[];
  className?: string;
};

const socialIconMap: Record<SocialPlatform, IconType> = {
  github: FaGithub,
  twitter: FaTwitter,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  tiktok: FaTiktok,
  pinterest: FaPinterestP,
  whatsapp: FaWhatsapp,
  spotify: FaSpotify,
};

export function SocialLinks({ className, links }: SocialLinksProps) {
  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {links.map((link) => (
        <li
          key={`${link.platform}-${link.href}`}
          className="pl-0 before:hidden"
        >
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="border-border text-muted-foreground hover:border-primary hover:text-primary focus-visible:ring-ring/50 inline-flex size-11 items-center justify-center rounded-full border transition duration-200 hover:scale-110 focus-visible:ring-3 focus-visible:outline-none active:scale-95"
          >
            {renderSocialIcon(link.platform, link.label)}
          </a>
        </li>
      ))}
    </ul>
  );
}

function renderSocialIcon(platform: SocialPlatform, label: string) {
  const Icon = socialIconMap[platform];

  return <Icon className="size-5" aria-hidden="true" title={label} />;
}
