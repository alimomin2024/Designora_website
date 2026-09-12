import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Remove Background from Image Free Online — AI Background Remover | Designora",
  description:
    "Remove background from image free online with AI. Create transparent PNG cutouts instantly for ecommerce, Amazon, Shopify, and social media. Powered by BiRefNet AI.",
  alternates: { canonical: "/tools/background-removal" },
  openGraph: {
    title: "Remove Background from Image Free Online — AI Background Remover | Designora",
    description: "Remove image backgrounds instantly with AI. Get clean transparent PNG cutouts for ecommerce and social media.",
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
