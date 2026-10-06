import { externalLinks } from "@/constants/routes";
import type { SocialLink } from "@/types/portfolio";

import { contato } from "./contato";

/**
 * PLACEHOLDER: troque os links pelos perfis reais da loja.
 * Os ícones vêm de `SocialLinks` (src/components/common/social-links.tsx).
 */
export const socialLinks = [
  {
    platform: "instagram",
    href: externalLinks.instagram,
    label: "Instagram",
  },
  {
    platform: "whatsapp",
    href: `https://wa.me/${contato.whatsapp}`,
    label: "WhatsApp",
  },
  {
    platform: "tiktok",
    href: "https://tiktok.com",
    label: "TikTok",
  },
  {
    platform: "pinterest",
    href: "https://pinterest.com",
    label: "Pinterest",
  },
] satisfies SocialLink[];
