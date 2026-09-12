import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Photo Size Reducer & Image Resizer Online Free — Resize JPG, PNG, WEBP | Designora",
  description:
    "Free online photo size reducer and image resizer. Resize photos to exact pixel dimensions or reduce image sizes without uploading to servers. 100% private, works in your browser.",
  alternates: { canonical: "/tools/resize" },
  openGraph: {
    title: "Photo Size Reducer & Image Resizer Online Free | Designora",
    description: "Resize JPG, PNG, WEBP images to any size instantly. Free online photo size reducer, private, no signup required.",
  },
};

export default function ResizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.resize} />
      <RelatedTools current="resize" />
    </>
  );
}
