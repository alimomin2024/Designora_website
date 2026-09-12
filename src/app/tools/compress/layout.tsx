import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Image Compressor Online Free — Reduce Image Size in KB (50KB, 100KB, 20KB) ",
  description:
    "Free online image compressor and photo size reducer. Compress JPG, PNG, and WEBP to 50KB, 100KB, or 20KB without losing quality. 100% private in-browser tool with no upload limits.",
  alternates: { canonical: "/tools/compress" },
  openGraph: {
    title: "Image Compressor Online — Reduce Image Size in KB | Designora",
    description: "Compress JPG, PNG, and WEBP images to 50KB, 100KB, or 20KB. Free, fast, private browser image compressor.",
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
