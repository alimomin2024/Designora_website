import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Image Format Converter Online - PNG JPG WEBP",
  description:
    "Convert image formats online for free. Convert PNG to JPG, JPG to PNG, and WEBP to JPG instantly in your browser.",
  alternates: { canonical: "/tools/convert" },
};

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.convert} />
    </>
  );
}
