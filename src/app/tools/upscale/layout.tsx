import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Free AI Image Upscaler — Convert Image to 4K Resolution Online",
  description:
    "Convert any image to 4K resolution online with our free AI image upscaler. Make photos 4K, upscale to 2K and 4K, and enhance image quality instantly with Real-ESRGAN.",
  alternates: { canonical: "/tools/upscale" },
  openGraph: {
    title: "AI Image Upscaler — Convert Pictures to 4K Free Online",
    description: "Make any image 4K with AI. Free 4K photo editor online — upscale photos, enhance quality, no signup.",
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
