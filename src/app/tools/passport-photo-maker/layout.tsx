import type { Metadata } from "next";
import ToolSeo from "@/components/ToolSeo";
import RelatedTools from "@/components/RelatedTools";
import { toolSeoData } from "@/lib/tool-seo-data";

export const metadata: Metadata = {
  title: "Passport Photo Maker Online Free — 2x2, 35x45mm & Govt Exam Presets",
  description:
    "Create official passport size photos online for free. Official presets for Indian passport (3.5x4.5cm), US visa (2x2 inch), Schengen (35x45mm), and PAN card. Download single photo or 6-photo print sheet under 50KB.",
  alternates: { canonical: "/tools/passport-photo-maker" },
  openGraph: {
    title: "Passport Photo Maker Online Free | Designora",
    description: "Make official passport size photos online for free. Presets for India, US, and Schengen visas with 6-photo print sheet.",
  },
};

export default function PassportPhotoMakerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo {...toolSeoData["passport-photo-maker"]} />
      <RelatedTools current="passport-photo-maker" />
    </>
  );
}
