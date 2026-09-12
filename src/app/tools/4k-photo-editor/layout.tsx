import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import UpscalingGuides from "@/components/UpscalingGuides";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "4K Photo Editor Online Free — AI Photo Editing & 4K Image Converter | Designora",
  description:
    "Free online 4K photo editor. Enhance photo resolution to 4K (3840×2160), edit image quality with AI, and download high-resolution photos without watermark.",
  alternates: { canonical: "/tools/4k-photo-editor" },
  openGraph: {
    title: "4K Photo Editor Online Free — AI Image Converter | Designora",
    description:
      "Edit and upscale photos to 4K resolution online for free with AI. Enlarge images up to 3840x2160 with no watermark.",
  },
};

export default function FourKPhotoEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.upscale} />
      <UpscalingGuides />
      <RelatedTools current="upscale" />
    </>
  );
}
