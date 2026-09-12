import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import UpscalingGuides from "@/components/UpscalingGuides";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "4K Photo Editor Online Free — AI Image Upscaler & HD Converter | Designora",
  description:
    "Convert images to 4K online free with AI. Enlarge photo resolution 2x and 4x up to 3840x2160, enhance photo quality, and download crisp high-resolution images without watermark.",
  alternates: { canonical: "/tools/upscale" },
  openGraph: {
    title: "4K Photo Editor Online Free — AI Image Upscaler | Designora",
    description:
      "Upscale photos and convert images to 4K resolution online with AI. Fast, high-resolution PNG download with no watermark.",
  },
};

export default function UpscaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.upscale} />
      <UpscalingGuides />
      <RelatedTools current="upscale" />
    </>
  );
}
