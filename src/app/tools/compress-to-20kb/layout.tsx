import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Compress Image to 20KB Online Free — Signature & Photo Size Reducer",
  description:
    "Compress image to 20KB online for free. Reduce photo and signature sizes to strictly under 20KB for competitive exams (UPSC, SSC, NEET, JEE), banking, and portal uploads.",
  alternates: { canonical: "/tools/compress-to-20kb" },
  openGraph: {
    title: "Compress Image to 20KB Online Free — Signature Reducer | Designora",
    description: "Compress photo or signature to under 20KB online. Free, fast, private in-browser tool.",
  },
};

export default function CompressTo20KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["compress-to-20kb"]} />
      <RelatedTools current="compress-to-20kb" />
    </>
  );
}
