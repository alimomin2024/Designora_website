import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "AI Photo Enhancer Free Online — Photo Quality Enhancer & Image Fixer ",
  description:
    "Enhance photo quality free online with AI. Automatically fix blurry images, adjust brightness, contrast, and sharpness. Free AI photo quality enhancer with instant preview.",
  alternates: { canonical: "/tools/enhance" },
  openGraph: {
    title: "AI Photo Enhancer Free Online — Photo Quality Enhancer | Designora",
    description: "Improve photo quality instantly with AI. Auto-fix blurry photos, lighting, and sharpness in one click.",
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
