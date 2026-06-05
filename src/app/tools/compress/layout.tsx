import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Compress Image Online Free — Reduce JPG, PNG File Size",
  description:
    "Compress images online for free. Reduce JPG, PNG, and WEBP file sizes by up to 80% with adjustable quality. No upload, runs in your browser.",
  alternates: { canonical: "/tools/compress" },
  openGraph: {
    title: "Free Online Image Compressor",
    description: "Reduce image file size while keeping quality. Free, fast, private.",
  },
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.compress} />
      <RelatedTools current="compress" />
    </>
  );
}
