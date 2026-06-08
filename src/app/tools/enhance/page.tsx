"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Download, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import BeforeAfter from "@/components/BeforeAfter";
import { useUsage } from "@/hooks/useUsage";

function autoEnhance(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;

  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] < minR) minR = d[i];
    if (d[i] > maxR) maxR = d[i];
    if (d[i + 1] < minG) minG = d[i + 1];
    if (d[i + 1] > maxG) maxG = d[i + 1];
    if (d[i + 2] < minB) minB = d[i + 2];
    if (d[i + 2] > maxB) maxB = d[i + 2];
  }

  const rangeR = maxR - minR || 1;
  const rangeG = maxG - minG || 1;
  const rangeB = maxB - minB || 1;

  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.round(((d[i] - minR) / rangeR) * 255);
    d[i + 1] = Math.round(((d[i + 1] - minG) / rangeG) * 255);
    d[i + 2] = Math.round(((d[i + 2] - minB) / rangeB) * 255);
  }

  for (let i = 0; i < d.length; i += 4) {
    const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
    const factor = 1.15;
    d[i] = Math.min(255, Math.max(0, Math.round(avg + (d[i] - avg) * factor)));
    d[i + 1] = Math.min(255, Math.max(0, Math.round(avg + (d[i + 1] - avg) * factor)));
    d[i + 2] = Math.min(255, Math.max(0, Math.round(avg + (d[i + 2] - avg) * factor)));
  }

  ctx.putImageData(imageData, 0, 0);

  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const outCtx = out.getContext("2d")!;

  outCtx.filter = "contrast(1.05) saturate(1.1)";
  outCtx.drawImage(canvas, 0, 0);

  return out;
}

export default function EnhancePage() {
  const { deduct, credits, dailyFreeRemaining } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setPreview(URL.createObjectURL(f));
  }, []);

  async function handleEnhance() {
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("enhance");
      if (!ok) throw new Error("This tool is currently unavailable.");

      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const enhanced = autoEnhance(canvas);
      const blob = await new Promise<Blob>((resolve, reject) =>
        enhanced.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Enhancement failed"))),
          "image/png",
        ),
      );
      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Enhancement failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Image Enhancer</h1>
              <p className="text-sm text-muted-foreground">Auto brightness, contrast, and color boost</p>
            </div>
          </div>
          <UsageBadge credits={credits} dailyFreeRemaining={dailyFreeRemaining} />
        </div>

        {!file ? (
          <ImageDropzone onFile={handleFile} />
        ) : (
          <div className="space-y-6">
            {!result && (
              <div className="glass rounded-2xl p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview!} alt="Original" className="mx-auto mb-4 max-h-72 rounded-lg object-contain" />
                <div className="flex gap-3">
                  <Button onClick={handleEnhance} disabled={processing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enhancing…</> : "Auto Enhance"}
                  </Button>
                  <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && preview && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <BeforeAfter before={preview} after={result} alt="Enhancement" />
                <div className="flex gap-3">
                  <a href={result} download="enhanced.png">
                    <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </a>
                  <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> New Image</Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
