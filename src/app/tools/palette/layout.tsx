import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Color Palette Extractor - Extract Colors from Image",
  description:
    "Extract dominant colors from any image online. Generate color palettes for branding, design systems, and creative projects.",
  alternates: { canonical: "/tools/palette" },
};

export default function PaletteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.palette} />
    </>
  );
}
