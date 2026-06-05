import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Remove Watermark from Image Free Online — AI Watermark Remover",
  description:
    "Remove watermarks, text, and logos from images with AI inpainting. Paint over unwanted areas and get clean results. Free online tool, no signup.",
  alternates: { canonical: "/tools/watermark-removal" },
  openGraph: {
    title: "Free AI Watermark Remover Online",
    description: "Erase watermarks from photos using AI. Fast, free, keeps original quality.",
  },
};

export default function WatermarkRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["watermark-removal"]} />
      <RelatedTools current="watermark-removal" />
    </>
  );
}
