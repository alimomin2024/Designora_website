import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Resize Image Online Free — Fast JPG, PNG, WEBP Resizer",
  description:
    "Resize images to exact dimensions online for free. No upload to servers — works in your browser. Supports JPG, PNG, and WEBP. No signup required.",
  alternates: { canonical: "/tools/resize" },
  openGraph: {
    title: "Free Online Image Resizer",
    description: "Resize JPG, PNG, WEBP images to any size instantly. Free, private, no signup.",
  },
};

export default function ResizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.resize} />
      <RelatedTools current="resize" />
    </>
  );
}
