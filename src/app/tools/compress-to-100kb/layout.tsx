import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Compress Image to 100KB Online Free — Fast JPG & PNG Compressor",
  description:
    "Compress image to 100KB online for free. Shrink JPG, PNG, and WEBP files to under 100KB while preserving maximum visual clarity. 100% private in-browser tool.",
  alternates: { canonical: "/tools/compress-to-100kb" },
  openGraph: {
    title: "Compress Image to 100KB Online Free | Designora",
    description: "Compress image file size to strictly under 100KB online. Free, fast, private in-browser tool.",
  },
};

export default function CompressTo100KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["compress-to-100kb"]} />
      <RelatedTools current="compress-to-100kb" />
    </>
  );
}
