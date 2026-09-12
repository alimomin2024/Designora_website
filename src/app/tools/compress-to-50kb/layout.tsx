import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Compress Image to 50KB Online Free — Reduce JPG & PNG File Size",
  description:
    "Compress image to 50KB online for free. Reduce JPG, PNG, and WEBP photo size to strictly under 50KB for government forms, SSC, UPSC, and visa applications. Fast, private in-browser tool.",
  alternates: { canonical: "/tools/compress-to-50kb" },
  openGraph: {
    title: "Compress Image to 50KB Online Free | Designora",
    description: "Reduce image file size to under 50KB online. Free, fast, private in-browser tool with no upload limits.",
  },
};

export default function CompressTo50KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["compress-to-50kb"]} />
      <RelatedTools current="compress-to-50kb" />
    </>
  );
}
