import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Change Image DPI Online Free — Metadata & DPI Editor",
  description:
    "View and change image DPI online for free. Set 300 DPI for print or 600 DPI for large format. Check dimensions, file size, and format instantly.",
  alternates: { canonical: "/tools/metadata" },
  openGraph: {
    title: "Free Image DPI Editor Online",
    description: "Change DPI, view metadata, and prepare images for print. Free, instant.",
  },
};

export default function MetadataLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.metadata} />
      <RelatedTools current="metadata" />
    </>
  );
}
