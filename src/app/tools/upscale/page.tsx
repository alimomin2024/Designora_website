"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpFromLine, Download, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import BeforeAfter from "@/components/BeforeAfter";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { getImageDimensions } from "@/lib/image-tools/resize";

const TIERS = [
  { id: "2k", label: "2K", scale: 2, dpi: 300, credits: 1 },
  { id: "4k", label: "4K", scale: 4, dpi: 300, credits: 2 },
  { id: "4k-600dpi", label: "4K + 600 DPI", scale: 4, dpi: 600, credits: 4 },
];

export default function UpscalePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { deduct, credits, dailyFreeRemaining } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [tier, setTier] = useState(TIERS[0]);
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setPreview(URL.createObjectURL(f));
    const dims = await getImageDimensions(f);
    setOrigDims({ w: dims.width, h: dims.height });
  }, []);

  async function handleUpscale() {
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("upscale", tier.id);
      if (!ok) {
        router.push("/pricing");
        return;
      }
      const formData = new FormData();
      formData.append("image", file);
      formData.append("tier", tier.id);
      const res = await fetch("/api/upscale", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upscale failed");
      const data = await res.json();
      setResult(data.imageURL);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upscale failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setOrigDims({ w: 0, h: 0 });
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <ArrowUpFromLine className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Image Upscaler</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered upscaling with Real-ESRGAN
              </p>
            </div>
          </div>
          <UsageBadge credits={credits} dailyFreeRemaining={dailyFreeRemaining} />
        </div>

        {!file ? (
          <ImageDropzone onFile={handleFile} />
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Tier:</span>
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTier(t)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      tier.id === t.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {t.label} ({t.credits} cr)
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">
                  {origDims.w}&times;{origDims.h} → {origDims.w * tier.scale}&times;
                  {origDims.h * tier.scale} @ {tier.dpi} DPI
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleUpscale}
                  disabled={processing}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Upscaling…
                    </>
                  ) : (
                    `Upscale ${tier.label}`
                  )}
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && preview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <BeforeAfter before={preview} after={result} alt="Upscale" />
                <a href={result} download={`upscaled-${tier.id}.png`}>
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Download className="h-4 w-4" /> Download Upscaled Image
                  </Button>
                </a>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
