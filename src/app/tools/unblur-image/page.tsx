"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Download, RotateCcw, Loader2, CheckCircle2, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import BeforeAfter from "@/components/BeforeAfter";

function unblurFilter(canvas: HTMLCanvasElement, strength: number): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const src = imgData.data;

  // Create an output canvas
  const outCanvas = document.createElement("canvas");
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext("2d")!;
  const outImgData = outCtx.createImageData(w, h);
  const dst = outImgData.data;

  // Unsharp mask convolution kernel
  // 0  -1   0
  // -1 4+c -1
  // 0  -1   0
  const c = strength * 2.2;
  const center = 4 + c;
  const div = c;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      for (let ch = 0; ch < 3; ch++) {
        const top = ((y - 1) * w + x) * 4 + ch;
        const bottom = ((y + 1) * w + x) * 4 + ch;
        const left = (y * w + (x - 1)) * 4 + ch;
        const right = (y * w + (x + 1)) * 4 + ch;
        const mid = idx + ch;

        const val =
          (src[mid] * center -
            (src[top] + src[bottom] + src[left] + src[right])) /
          div;

        dst[mid] = Math.min(255, Math.max(0, Math.round(val)));
      }
      dst[idx + 3] = src[idx + 3]; // preserve alpha
    }
  }

  // Slight local contrast boost to restore washed out soft edges
  for (let i = 0; i < dst.length; i += 4) {
    for (let ch = 0; ch < 3; ch++) {
      const v = dst[i + ch];
      // subtle s-curve
      dst[i + ch] = Math.min(255, Math.max(0, Math.round(v + (v - 128) * 0.15)));
    }
  }

  outCtx.putImageData(outImgData, 0, 0);
  return outCanvas;
}

export default function UnblurImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [strength, setStrength] = useState<number>(1.2); // Medium
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const runUnblur = useCallback(async (sourceFile: File, unblurStrength: number) => {
    setProcessing(true);
    setError("");
    try {
      const img = new Image();
      const url = URL.createObjectURL(sourceFile);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const unblurredCanvas = unblurFilter(canvas, unblurStrength);
      const blob: Blob = await new Promise((resolve) =>
        unblurredCanvas.toBlob((b) => resolve(b!), "image/png"),
      );

      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to unblur image");
    } finally {
      setProcessing(false);
    }
  }, []);

  useEffect(() => {
    if (file) {
      void runUnblur(file, strength);
    }
  }, [file, strength, runUnblur]);

  function handleReset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          In-Browser Clarity & Sharpness Enhancement
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Unblur Image Online Free
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Fix blurry photos, restore soft edges, and sharpen low-contrast images instantly. 100% private in your browser with zero limits.
        </p>
      </div>

      {!file ? (
        <ImageDropzone onFile={handleFile} accept="image/png,image/jpeg,image/webp,image/jpg" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Controls Bar */}
          <div className="glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Unblur Intensity:</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { id: "mild", label: "Mild", val: 0.8 },
                { id: "medium", label: "Medium", val: 1.2 },
                { id: "strong", label: "Strong", val: 1.8 },
                { id: "ultra", label: "Ultra", val: 2.5 },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStrength(s.val)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    strength === s.val
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "border border-border/80 hover:border-primary/40 bg-background/50 text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Before & After */}
          <div className="glass rounded-2xl p-6 border border-border/60">
            {processing ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Unblurring and restoring details...</span>
              </div>
            ) : preview && result ? (
              <BeforeAfter before={preview} after={result} alt="Unblurred comparison" />
            ) : null}
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Unblur Another Photo
            </Button>
            {result && !processing && (
              <a
                href={result}
                download={`unblurred_${file.name.replace(/\.[^.]+$/, "")}.png`}
                className="inline-flex"
              >
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Download className="h-4 w-4" />
                  Download Unblurred Image
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
