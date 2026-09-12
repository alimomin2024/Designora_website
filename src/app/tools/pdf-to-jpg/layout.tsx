import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "PDF to JPG Converter Free Online — Extract PDF Pages to JPG",
  description:
    "Convert PDF to JPG online for free. Extract every page from your PDF file as a high-resolution JPEG image in your browser. 100% private, no file uploads required.",
  alternates: { canonical: "/tools/pdf-to-jpg" },
  openGraph: {
    title: "PDF to JPG Converter Free Online | Designora",
    description: "Convert PDF pages to JPG images instantly online. Private, fast in-browser extraction.",
  },
};

export default function PdfToJpgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["pdf-to-jpg"]} />
      <RelatedTools current="pdf-to-jpg" />
    </>
  );
}
