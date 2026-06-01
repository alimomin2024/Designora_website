import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Batch Image Resizer Online - Resize Multiple Images",
  description:
    "Resize multiple images at once with batch image resizer. Save time by applying the same dimensions to all your photos in one go.",
  alternates: { canonical: "/tools/batch-resize" },
};

export default function BatchResizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["batch-resize"]} />
    </>
  );
}
