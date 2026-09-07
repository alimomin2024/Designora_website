import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Crop and Rotate Image Online Free — JPG, PNG, WEBP",
  description:
    "Crop and rotate JPG, PNG, and WEBP images online for free. Set an exact crop box, rotate in 90-degree increments, and download locally in your browser.",
  alternates: { canonical: "/tools/crop-rotate" },
  openGraph: {
    title: "Crop and Rotate Images Online | Designora",
    description: "Crop, rotate, and download images without uploading them to a server.",
  },
};

export default function CropRotateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["crop-rotate"]} />
      <RelatedTools current="crop-rotate" />
    </>
  );
}
