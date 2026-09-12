"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { FileDown, Download, RotateCcw, Loader2, CheckCircle2, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";

interface TargetCompressClientProps {
  defaultTargetKB: number;
  title: string;
  subtitle: string;
}

export default function TargetCompressClient({
  defaultTargetKB,
  title,
  subtitle,
}: TargetCompressClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [targetKB, setTargetKB] = useState(defaultTargetKB);
  const [customInput, setCustomInput] = useState(String(defaultTargetKB));
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [resultDims, setResultDims] = useState<{ w: number; h: number } | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setOriginalSize(f.size);
    setCompressedSize(0);
    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;
  }, []);

  const runCompression = useCallback(
    async (sourceFile: File, maxKB: number) => {
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

        const targetBytes = maxKB * 1024;
        let scale = 1.0;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d")!;
        let bestBlob: Blob | null = null;

        // Try full resolution first, downscale resolution if needed
        for (let attempt = 0; attempt < 5; attempt++) {
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let low = 0.05;
          let high = 0.95;
          let foundInThisScale: Blob | null = null;

          for (let iter = 0; iter < 7; iter++) {
            const q = (low + high) / 2;
            const b: Blob = await new Promise((resolve) =>
              canvas.toBlob((blob) => resolve(blob!), "image/jpeg", q),
            );
            if (b.size <= targetBytes) {
              foundInThisScale = b;
              low = q; // try slightly higher quality
            } else {
              high = q; // lower quality
            }
          }

          if (foundInThisScale) {
            bestBlob = foundInThisScale;
            setResultDims({ w: canvas.width, h: canvas.height });
            break;
          }

          // If even 5% quality is larger than targetBytes, reduce dimensions by 15%
          scale *= 0.85;
        }

        if (!bestBlob) {
          // Fallback to lowest possible output
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          bestBlob = await new Promise((resolve) =>
            canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.1),
          );
          setResultDims({ w: canvas.width, h: canvas.height });
        }

        if (bestBlob) {
          setCompressedSize(bestBlob.size);
          setResult(URL.createObjectURL(bestBlob));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Compression failed");
      } finally {
        setProcessing(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (file) {
      void runCompression(file, targetKB);
    }
  }, [file, targetKB, runCompression]);

  function handlePreset(kb: number) {
    setTargetKB(kb);
    setCustomInput(String(kb));
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0 && val <= 50000) {
      setTargetKB(val);
    }
  }

  function handleReset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setOriginalSize(0);
    setCompressedSize(0);
    setOriginalDims(null);
    setResultDims(null);
  }

  const reduction =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Guaranteed File Size: Under {targetKB} KB
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Target Size Presets */}
      <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Select Target Size:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[20, 50, 100, 200, 500].map((kb) => (
            <button
              key={kb}
              type="button"
              onClick={() => handlePreset(kb)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                targetKB === kb
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "border border-border/80 hover:border-primary/40 bg-background/50 text-foreground"
              }`}
            >
              {kb} KB
            </button>
          ))}
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 ml-2">
            <input
              type="number"
              min="5"
              max="10000"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-20 rounded-xl border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Custom"
            />
            <Button type="submit" variant="outline" size="sm" className="h-7 px-2 text-xs">
              Set
            </Button>
          </form>
        </div>
      </div>

      {/* Upload or Results */}
      {!file ? (
        <ImageDropzone onFile={handleFile} accept="image/png,image/jpeg,image/webp,image/jpg" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Comparison Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Original */}
            <div className="glass rounded-2xl p-5 border border-border/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original Image
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {(originalSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              {originalDims && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {originalDims.w} × {originalDims.h} px
                </p>
              )}
            </div>

            {/* Compressed */}
            <div className="glass rounded-2xl p-5 border border-primary/30 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Compressed Output
                </span>
                <div className="flex items-center gap-2">
                  {compressedSize > 0 && (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      -{reduction}%
                    </span>
                  )}
                  <span className="text-xs font-bold text-foreground">
                    {compressedSize > 0 ? `${(compressedSize / 1024).toFixed(1)} KB` : "Processing..."}
                  </span>
                </div>
              </div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                {processing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Optimizing to under {targetKB} KB...</span>
                  </div>
                ) : result ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result}
                    alt="Compressed"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Waiting for result...</span>
                )}
              </div>
              {resultDims && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {resultDims.w} × {resultDims.h} px · Fits strictly under {targetKB} KB
                </p>
              )}
            </div>
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
              Compress Another Image
            </Button>
            {result && !processing && (
              <a
                href={result}
                download={`compressed_${targetKB}kb_${file.name.replace(/\.[^.]+$/, "")}.jpg`}
                className="inline-flex"
              >
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Download className="h-4 w-4" />
                  Download Image ({(compressedSize / 1024).toFixed(1)} KB)
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
