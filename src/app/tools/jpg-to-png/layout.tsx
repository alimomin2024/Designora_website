import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "JPG to PNG Converter Free Online — Lossless Image Converter",
  description:
    "Convert JPG to PNG online for free. Convert JPEG images to high-quality lossless PNG format directly in your browser. Fast, private, with zero upload limits.",
  alternates: { canonical: "/tools/jpg-to-png" },
  openGraph: {
    title: "JPG to PNG Converter Free Online | Designora",
    description: "Convert JPG photos to PNG format instantly online. 100% private in-browser conversion.",
  },
};

export default function JpgToPngLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["jpg-to-png"]} />
      <RelatedTools current="jpg-to-png" />
    </>
  );
}
