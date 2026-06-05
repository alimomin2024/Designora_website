import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Convert PNG to JPG Free Online — Image Format Converter",
  description:
    "Convert between PNG, JPG, and WEBP formats online for free. Fast browser-based conversion with no upload. No signup, no watermark.",
  alternates: { canonical: "/tools/convert" },
  openGraph: {
    title: "Free PNG to JPG Converter Online",
    description: "Convert PNG to JPG, JPG to WEBP, and more. Free, instant, private.",
  },
};

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.convert} />
      <RelatedTools current="convert" />
    </>
  );
}
