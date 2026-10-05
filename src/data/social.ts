import type { SocialLink } from "@/types/portfolio";
import { contato } from "./contato";

export const socialLinks = [
  {
    platform: "github",
    href: "https://github.com",
    label: "GitHub",
  },
  {
    platform: "twitter",
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    platform: "linkedin",
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
] satisfies SocialLink[];