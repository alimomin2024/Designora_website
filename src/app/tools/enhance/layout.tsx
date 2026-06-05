import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Enhance Image Quality Free Online — AI Photo Enhancer",
  description:
    "Improve photo quality instantly with AI. Auto-fix brightness, contrast, and sharpness. Free online image enhancer — no signup, no watermark.",
  alternates: { canonical: "/tools/enhance" },
  openGraph: {
    title: "Free AI Image Enhancer Online",
    description: "Enhance photo quality with one click. AI brightness, contrast, sharpness fix.",
  },
};

export default function EnhanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.enhance} />
      <RelatedTools current="enhance" />
    </>
  );
}
