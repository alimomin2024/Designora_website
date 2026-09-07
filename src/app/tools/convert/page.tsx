"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Download, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useUsage } from "@/hooks/useUsage";

const FORMATS = [
  { id: "image/png", label: "PNG", ext: "png" },
  { id: "image/jpeg", label: "JPG", ext: "jpg" },
  { id: "image/webp", label: "WEBP", ext: "webp" },
];

export default function ConvertPage() {
  const { deduct, credits } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [format, setFormat] = useState(FORMATS[0]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setPreview(URL.createObjectURL(f));
  }, []);

  async function handleConvert() {
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("convert");
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
          (b) => (b ? resolve(b) : reject(new Error("Conversion failed"))),
          format.id,
          format.id === "image/jpeg" ? 0.92 : undefined,
        ),
      );

      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Conversion failed");
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PNG, JPG and WEBP Converter</h1>
              <p className="text-sm text-muted-foreground">Convert between PNG, JPG, WEBP</p>
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
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Convert to:</span>
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      format.id === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={handleConvert} disabled={processing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting…</> : `Convert to ${format.label}`}
                </Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <a href={result} download={`converted.${format.ext}`}>
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Download className="h-4 w-4" /> Download {format.label}
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
