import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Image Metadata & DPI Editor Online",
  description:
    "View and edit image metadata and DPI settings online. Prepare print-ready files and update image properties quickly.",
  alternates: { canonical: "/tools/metadata" },
};

export default function MetadataLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.metadata} />
    </>
  );
}
