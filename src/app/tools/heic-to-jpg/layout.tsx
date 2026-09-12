import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter Free Online — Convert iPhone Photos to JPG & PNG ",
  description:
    "Convert HEIC to JPG online for free. Fast iPhone HEIC photo converter to JPG or PNG with 100% private local browser decoding. No upload to servers, no size limits.",
  alternates: { canonical: "/tools/heic-to-jpg" },
  openGraph: {
    title: "HEIC to JPG Converter Free Online | Designora",
    description: "Convert iPhone HEIC and HEIF photos to JPG or PNG online. Fast, private local browser conversion.",
  },
};

export default function HeicToJpgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["heic-to-jpg"]} />
      <RelatedTools current="heic-to-jpg" />
    </>
  );
}
