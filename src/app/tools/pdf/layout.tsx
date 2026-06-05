import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "PDF to Image Converter Free Online — Also Image to PDF",
  description:
    "Convert PDF pages to high-quality PNG images or combine images into a single PDF. Free, works in browser, no signup. Fast and private.",
  alternates: { canonical: "/tools/pdf" },
  openGraph: {
    title: "Free PDF to Image & Image to PDF Converter",
    description: "Convert PDF to PNG or merge images into PDF. Free, instant, no upload.",
  },
};

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.pdf} />
      <RelatedTools current="pdf" />
    </>
  );
}
