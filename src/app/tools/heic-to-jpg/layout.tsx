import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter Online — Convert HEIF to PNG",
  description:
    "Convert HEIC and HEIF photos to JPG or PNG in your browser. Private local processing and no account required.",
  alternates: { canonical: "/tools/heic-to-jpg" },
  openGraph: {
    title: "HEIC to JPG Converter Online | Designora",
    description: "Convert iPhone HEIC and HEIF photos to JPG or PNG in your browser.",
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
