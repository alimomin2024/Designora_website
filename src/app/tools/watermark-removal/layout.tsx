import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "AI Watermark Remover Online - Remove Text from Image",
  description:
    "Remove watermarks from images using AI inpainting. Paint over text or logos and regenerate clean results while preserving image quality.",
  alternates: { canonical: "/tools/watermark-removal" },
};

export default function WatermarkRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["watermark-removal"]} />
    </>
  );
}
