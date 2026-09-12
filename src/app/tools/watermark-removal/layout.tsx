import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Remove Watermark from Photo Online Free — AI Watermark Remover | Designora",
  description:
    "Remove watermarks, logos, date stamps, and text from photos online using AI inpainting. Clean photo restoration with original quality preserved. Fast and precise.",
  alternates: { canonical: "/tools/watermark-removal" },
  openGraph: {
    title: "Remove Watermark from Photo Online Free — AI Watermark Remover | Designora",
    description: "Erase watermarks, text, and logos from photos using AI inpainting. Clean, fast results with original resolution preserved.",
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
