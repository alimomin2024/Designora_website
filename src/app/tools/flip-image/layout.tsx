import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Flip Image Online Free — Mirror Image & Flip Photo Horizontally/Vertically",
  description:
    "Flip image online for free. Create horizontal mirror photos or flip images upside down vertically in your browser. Fast, private, with zero upload limits.",
  alternates: { canonical: "/tools/flip-image" },
  openGraph: {
    title: "Flip Image Online Free — Mirror Image Tool | Designora",
    description: "Flip and mirror images horizontally and vertically online for free. 100% private in-browser tool.",
  },
};

export default function FlipImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["flip-image"]} />
      <RelatedTools current="flip-image" />
    </>
  );
}
