import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Free AI Image Upscaling Tool - Increase Resolution of Your Images Online",
  description:
    "Increase image resolution online with our free AI image upscaling tool. Upscale photos to 2K and 4K, sharpen details, and improve quality in seconds.",
  alternates: { canonical: "/tools/upscale" },
  openGraph: {
    title: "Free AI Image Upscaler — 2K & 4K Online",
    description: "Upscale any image to 2K or 4K with AI. Free, fast, no signup required.",
  },
};

export default function UpscaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.upscale} />
      <RelatedTools current="upscale" />
    </>
  );
}
