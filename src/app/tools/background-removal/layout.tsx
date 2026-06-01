import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "AI Background Remover Online - Remove Image Background",
  description:
    "Remove image backgrounds online with AI. Create clean transparent PNG cutouts for ecommerce listings, social posts, and product photos.",
  alternates: { canonical: "/tools/background-removal" },
};

export default function BackgroundRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["background-removal"]} />
    </>
  );
}
