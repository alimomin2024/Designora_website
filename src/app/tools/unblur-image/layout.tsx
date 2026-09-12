import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Unblur Image Online Free — AI Photo Sharpener & Clarity Enhancer",
  description:
    "Unblur image online free. Fix blurry photos, sharpen soft edges, and enhance photo clarity in seconds. Private in-browser tool with interactive before/after slider.",
  alternates: { canonical: "/tools/unblur-image" },
  openGraph: {
    title: "Unblur Image Online Free | Designora",
    description: "Fix blurry photos and restore edge clarity online for free. In-browser processing with zero limits.",
  },
};

export default function UnblurImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["unblur-image"]} />
      <RelatedTools current="unblur-image" />
    </>
  );
}
