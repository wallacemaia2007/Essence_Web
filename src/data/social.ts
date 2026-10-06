import { externalLinks } from "@/constants/routes";
import type { SocialLink } from "@/types/portfolio";

import { contato } from "./contato";

const facebookUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || externalLinks.facebook;
const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() ||
  `https://wa.me/${contato.whatsapp}`;

/** Os links do Facebook e do WhatsApp podem ser ajustados no ambiente público. */
export const socialLinks = [
  {
    platform: "instagram",
    href: externalLinks.instagram,
    label: "Instagram",
  },
  ...(facebookUrl
    ? [
        {
          platform: "facebook" as const,
          href: facebookUrl,
          label: "Facebook",
        },
      ]
    : []),
  {
    platform: "whatsapp",
    href: whatsappUrl,
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
