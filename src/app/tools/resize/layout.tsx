import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Image Resizer Online Free - Resize JPG, PNG, WEBP",
  description:
    "Resize images online for free. Change width and height of JPG, PNG, and WEBP images instantly without losing quality.",
  alternates: { canonical: "/tools/resize" },
};

export default function ResizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.resize} />
    </>
  );
}
