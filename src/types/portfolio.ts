export type SocialPlatform =
  | "github"
  | "twitter"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "facebook"
  | "tiktok"
  | "pinterest"
  | "whatsapp"
  | "spotify";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};
