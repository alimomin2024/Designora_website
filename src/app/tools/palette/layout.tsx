import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Extract Color Palette from Image Free Online — Hex Codes Included",
  description:
    "Extract dominant colors from any image online. Get hex codes for branding, design systems, and creative projects. Free, no signup required.",
  alternates: { canonical: "/tools/palette" },
  openGraph: {
    title: "Free Color Palette Extractor from Image",
    description: "Upload an image and extract its dominant color palette with hex codes.",
  },
};

export default function PaletteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.palette} />
      <RelatedTools current="palette" />
    </>
  );
}
