import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "WEBP to JPG Converter Free Online — Convert WEBP to JPEG Instantly",
  description:
    "Convert WEBP to JPG online for free. Turn WEBP images into widely compatible JPG format in your browser with adjustable quality. 100% private and unlimited.",
  alternates: { canonical: "/tools/webp-to-jpg" },
  openGraph: {
    title: "WEBP to JPG Converter Free Online | Designora",
    description: "Convert WEBP images to JPG online instantly. Fast, private browser conversion with no upload limits.",
  },
};

export default function WebpToJpgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["webp-to-jpg"]} />
      <RelatedTools current="webp-to-jpg" />
    </>
  );
}
