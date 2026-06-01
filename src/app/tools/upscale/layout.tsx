import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "AI Image Upscaler Free - 2K & 4K Upscale Online",
  description:
    "Upscale images online with AI upscaler. Enhance quality to 2K and 4K using Real-ESRGAN for photos, artwork, and product images.",
  alternates: { canonical: "/tools/upscale" },
};

export default function UpscaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData.upscale} />
    </>
  );
}
