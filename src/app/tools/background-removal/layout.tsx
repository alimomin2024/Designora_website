import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Remove Background from Image Free Online — AI Background Remover",
  description:
    "Remove image backgrounds instantly with AI. Get clean transparent PNG cutouts for ecommerce, social media, and product photos. Free, no signup.",
  alternates: { canonical: "/tools/background-removal" },
  openGraph: {
    title: "Free AI Background Remover Online",
    description: "Remove backgrounds from images with one click. Transparent PNG output, free.",
  },
};

export default function BackgroundRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["background-removal"]} />
      <RelatedTools current="background-removal" />
    </>
  );
}
