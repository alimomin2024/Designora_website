import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "AI Image Upscaler Free Online — Upscale to 2K & 4K, No Signup",
  description:
    "Upscale images to 2K and 4K for free using Real-ESRGAN AI. No signup, no watermark. Enhance photos, artwork, and product images online in seconds.",
  alternates: { canonical: "/tools/upscale" },
  openGraph: {
    title: "Free AI Image Upscaler — 2K & 4K Online",
    description: "Upscale any image to 2K or 4K with AI. Free, fast, no signup required.",
  },
};

export default function UpscaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.upscale} />
      <RelatedTools current="upscale" />
    </>
  );
}
