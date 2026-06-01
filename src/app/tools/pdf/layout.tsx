import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "PDF to Image Converter Online - Image to PDF",
  description:
    "Convert PDF pages to images or merge images into a PDF online. Fast PDF to PNG and image to PDF conversion tool.",
  alternates: { canonical: "/tools/pdf" },
};

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.pdf} />
    </>
  );
}
