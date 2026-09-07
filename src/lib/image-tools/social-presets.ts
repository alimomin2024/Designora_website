export const SOCIAL_PRESETS = [
  { id: "instagram-square", label: "Instagram square post", width: 1080, height: 1080 },
  { id: "instagram-portrait", label: "Instagram portrait post", width: 1080, height: 1350 },
  { id: "instagram-story", label: "Instagram Story / Reels", width: 1080, height: 1920 },
  { id: "facebook-post", label: "Facebook post", width: 1200, height: 630 },
  { id: "x-post", label: "X post", width: 1600, height: 900 },
  { id: "linkedin-post", label: "LinkedIn post", width: 1200, height: 627 },
  { id: "youtube-thumbnail", label: "YouTube thumbnail", width: 1280, height: 720 },
  { id: "pinterest-pin", label: "Pinterest pin", width: 1000, height: 1500 },
  { id: "tiktok", label: "TikTok video cover", width: 1080, height: 1920 },
] as const;

export type SocialPreset = (typeof SOCIAL_PRESETS)[number];
