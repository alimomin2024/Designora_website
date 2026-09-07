import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Social Media Image Resizer — Instagram, Facebook and More",
  description:
    "Resize and crop images for Instagram, Facebook, TikTok, YouTube, Pinterest, X, and LinkedIn with ready-made pixel presets or custom dimensions.",
  alternates: { canonical: "/tools/social-media-image-size" },
  openGraph: {
    title: "Social Media Image Resizer | Designora",
    description: "Prepare images for common social media sizes with crop or fit modes.",
  },
};

export default function SocialMediaImageSizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["social-media-image-size"]} />
      <RelatedTools current="social-media-image-size" />
    </>
  );
}
