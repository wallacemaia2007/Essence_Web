export type SocialPlatform =
  | "github"
  | "twitter"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "facebook"
  | "tiktok"
  | "whatsapp"
  | "spotify";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};
