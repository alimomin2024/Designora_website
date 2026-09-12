import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "JPG to PDF Converter Free Online — Convert Image to PDF",
  description:
    "Convert JPG to PDF online for free. Combine multiple JPG, PNG, and WEBP photos into a single PDF document in your browser. 100% private with no upload limits.",
  alternates: { canonical: "/tools/jpg-to-pdf" },
  openGraph: {
    title: "JPG to PDF Converter Free Online | Designora",
    description: "Convert images to PDF format instantly online. Fast, private in-browser tool with zero server uploads.",
  },
};

export default function JpgToPdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["jpg-to-pdf"]} />
      <RelatedTools current="jpg-to-pdf" />
    </>
  );
}
