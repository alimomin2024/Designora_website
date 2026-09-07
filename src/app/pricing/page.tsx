import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import PricingContent from "./PricingContent";

export const metadata: Metadata = {
  title: "Affordable AI Image Tools Pricing",
  description:
    "Use Designora's non-AI image tools for free or buy flexible credits for AI upscaling, background removal, and watermark removal. No monthly subscription required.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Affordable AI Image Tools Pricing | Designora",
    description:
      "Free unlimited image tools plus flexible pay-as-you-go credits for AI image processing.",
    url: "/pricing",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pb-4 pt-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Simple, honest <span className="gradient-text">pricing</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Resize, compress, convert, batch process, and enhance images for free. AI tools use
          flexible credits only when you need them, with no monthly subscription.
        </p>
      </section>
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <PricingContent />
      </Suspense>
    </>
  );
}
