import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Circle Crop Image Online Free — Round Photo Maker & Avatar Cropper",
  description:
    "Crop image into a circle online for free. Create circular profile pictures and avatars with transparent PNG backgrounds for LinkedIn, Discord, and Instagram. Fast, private in-browser tool.",
  alternates: { canonical: "/tools/circle-crop" },
  openGraph: {
    title: "Circle Crop Image Online Free — Round Photo Maker | Designora",
    description: "Crop photos into perfect circles with transparent background. 100% private in-browser tool.",
  },
};

export default function CircleCropLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["circle-crop"]} />
      <RelatedTools current="circle-crop" />
    </>
  );
}
