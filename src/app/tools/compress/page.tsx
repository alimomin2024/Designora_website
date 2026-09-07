"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileDown, Download, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useUsage } from "@/hooks/useUsage";

export default function CompressPage() {
  const { deduct, credits } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setOriginalSize(f.size);
    setCompressedSize(0);
    setPreview(URL.createObjectURL(f));
  }, []);

  async function handleCompress() {
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("compress");
      if (!ok) throw new Error("This tool is currently unavailable.");

      const img = new Image();
      const url = URL.createObjectURL(file);
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

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
          "image/jpeg",
          quality / 100,
        ),
      );

      setCompressedSize(blob.size);
      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Compression failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setOriginalSize(0);
    setCompressedSize(0);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/20">
              <FileDown className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Compress Image Online</h1>
              <p className="text-sm text-muted-foreground">Reduce file size with quality control</p>
            </div>
          </div>
          <UsageBadge credits={credits} />
        </div>

        {!file ? (
          <ImageDropzone onFile={handleFile} />
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Original" className="mx-auto mb-4 max-h-64 rounded-lg object-contain" />
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Quality: {quality}%</span>
                  <span className="text-xs text-muted-foreground">Original: {formatSize(originalSize)}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCompress} disabled={processing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Compressing…</> : "Compress"}
                </Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Compressed: {formatSize(compressedSize)}</span>
                  <span className="text-sm font-medium text-emerald-400">
                    {originalSize > 0 ? `${Math.round((1 - compressedSize / originalSize) * 100)}% smaller` : ""}
                  </span>
                </div>
                <a href={result} download="compressed.jpg">
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Download className="h-4 w-4" /> Download
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
