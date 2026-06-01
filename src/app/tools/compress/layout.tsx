import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Image Compressor Online - Reduce JPG PNG Size",
  description:
    "Compress images online to reduce file size while keeping quality. Optimize JPG, PNG, and WEBP images for web, ecommerce, and social media.",
  alternates: { canonical: "/tools/compress" },
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.compress} />
    </>
  );
}
