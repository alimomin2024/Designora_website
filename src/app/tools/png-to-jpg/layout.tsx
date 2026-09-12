import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "PNG to JPG Converter Free Online — Fast & Private Image Converter",
  description:
    "Convert PNG to JPG online for free. Fast, secure, in-browser PNG to JPEG conversion with quality adjustment. No file uploads, no watermarks, unlimited conversions.",
  alternates: { canonical: "/tools/png-to-jpg" },
  openGraph: {
    title: "PNG to JPG Converter Free Online | Designora",
    description: "Convert PNG images to JPG format instantly in your browser. 100% private and free.",
  },
};

export default function PngToJpgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["png-to-jpg"]} />
      <RelatedTools current="png-to-jpg" />
    </>
  );
}
