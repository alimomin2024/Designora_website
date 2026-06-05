import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Batch Resize Images Online Free — Resize Multiple Photos at Once",
  description:
    "Resize multiple images at once to the same dimensions. Free batch image resizer — drag, drop, download. No upload to servers, works in browser.",
  alternates: { canonical: "/tools/batch-resize" },
  openGraph: {
    title: "Free Batch Image Resizer Online",
    description: "Resize multiple images at once. Free, fast, no signup needed.",
  },
};

export default function BatchResizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["batch-resize"]} />
      <RelatedTools current="batch-resize" />
    </>
  );
}
