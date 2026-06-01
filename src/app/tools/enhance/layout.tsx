import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "AI Image Enhancer Online - Improve Photo Quality",
  description:
    "Enhance photo quality online with AI. Improve brightness, contrast, and sharpness to make images clearer and more vibrant.",
  alternates: { canonical: "/tools/enhance" },
};

export default function EnhanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.enhance} />
    </>
  );
}
