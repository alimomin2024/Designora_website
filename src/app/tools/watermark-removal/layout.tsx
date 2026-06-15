import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Remove Watermark from Image Online — AI Watermark Remover",
  description:
    "Remove watermarks, text, and logos from images with AI inpainting. Paint over unwanted areas and get clean results. Affordable pay-as-you-go credits.",
  alternates: { canonical: "/tools/watermark-removal" },
  openGraph: {
    title: "AI Watermark Remover — Erase Watermarks from Photos Online",
    description: "Erase watermarks from photos using AI inpainting. Fast, clean results, original quality preserved.",
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
