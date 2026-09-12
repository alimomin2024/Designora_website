"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";

interface PairConverterProps {
  fromFormat: string;
  toFormat: string;
  targetMime: "image/jpeg" | "image/png" | "image/webp";
  targetExtension: "jpg" | "png" | "webp";
  title: string;
  subtitle: string;
}

export default function PairConverterClient({
  fromFormat,
  toFormat,
  targetMime,
  targetExtension,
  title,
  subtitle,
}: PairConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setOriginalSize(f.size);
    setConvertedSize(0);
    setPreview(URL.createObjectURL(f));
  }, []);

  const convertImage = useCallback(
    async (sourceFile: File, q: number) => {
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

        // Fill white background for JPEG exports if transparency exists
        if (targetMime === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Conversion failed"))),
            targetMime,
            targetMime === "image/jpeg" ? q / 100 : undefined,
          ),
        );

        setConvertedSize(blob.size);
        setResult(URL.createObjectURL(blob));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Conversion failed");
      } finally {
        setProcessing(false);
      }
    },
    [targetMime],
  );

  useEffect(() => {
    if (file) {
      void convertImage(file, quality);
    }
  }, [file, quality, convertImage]);

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
          Fast In-Browser {fromFormat} to {toFormat} Conversion
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {!file ? (
        <ImageDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quality Slider (for JPG outputs) */}
          {targetMime === "image/jpeg" && (
            <div className="glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-semibold">Output JPG Quality:</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-44 accent-primary"
                />
                <span className="text-sm font-bold text-primary w-12 text-right">{quality}%</span>
              </div>
            </div>
          )}

          {/* Comparison Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Original */}
            <div className="glass rounded-2xl p-5 border border-border/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original ({fromFormat})
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
                    alt={`Original ${fromFormat}`}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* Converted */}
            <div className="glass rounded-2xl p-5 border border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Converted ({toFormat})
                </span>
                <span className="text-xs font-bold text-foreground">
                  {convertedSize > 0 ? `${(convertedSize / 1024).toFixed(1)} KB` : "Converting..."}
                </span>
              </div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                {processing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Converting to {toFormat}...</span>
                  </div>
                ) : result ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result}
                    alt={`Converted ${toFormat}`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : null}
              </div>
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
              Convert Another Image
            </Button>
            {result && !processing && (
              <a
                href={result}
                download={`${file.name.replace(/\.[^.]+$/, "")}.${targetExtension}`}
                className="inline-flex"
              >
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Download className="h-4 w-4" />
                  Download {toFormat} ({(convertedSize / 1024).toFixed(1)} KB)
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
