import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import UpscalingGuides from "@/components/UpscalingGuides";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Convert Image to 4K Online with AI — 2× or 4× Upscaler",
  description:
    "Convert photos and images into larger, 4K-ready results online with AI. Choose 2× or 4× scaling, preview the output dimensions, and download a high-resolution PNG while preserving aspect ratio.",
  alternates: { canonical: "/tools/upscale" },
  openGraph: {
    title: "Convert Image to 4K Online with AI | Designora",
    description:
      "Convert an image or photo to a larger 4K-ready result with 2× or 4× AI scaling and a high-resolution PNG download.",
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
