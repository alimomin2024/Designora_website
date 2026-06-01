"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Palette, RotateCcw, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";

interface ColorInfo {
  hex: string;
  rgb: [number, number, number];
  count: number;
}

function kMeansColors(imageData: ImageData, k = 6, iterations = 20): ColorInfo[] {
  const pixels: [number, number, number][] = [];
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 16) {
    if (d[i + 3] > 128) pixels.push([d[i], d[i + 1], d[i + 2]]);
  }
  if (pixels.length === 0) return [];

  let centroids: [number, number, number][] = [];
  const step = Math.max(1, Math.floor(pixels.length / k));
  for (let i = 0; i < k; i++) centroids.push([...pixels[i * step] || pixels[0]]);

  let assignments = new Array(pixels.length).fill(0);

  for (let iter = 0; iter < iterations; iter++) {
    for (let p = 0; p < pixels.length; p++) {
      let minDist = Infinity;
      let best = 0;
      for (let c = 0; c < centroids.length; c++) {
        const dr = pixels[p][0] - centroids[c][0];
        const dg = pixels[p][1] - centroids[c][1];
        const db = pixels[p][2] - centroids[c][2];
        const dist = dr * dr + dg * dg + db * db;
        if (dist < minDist) { minDist = dist; best = c; }
      }
      assignments[p] = best;
    }

    const sums = centroids.map(() => [0, 0, 0, 0] as [number, number, number, number]);
    for (let p = 0; p < pixels.length; p++) {
      const c = assignments[p];
      sums[c][0] += pixels[p][0];
      sums[c][1] += pixels[p][1];
      sums[c][2] += pixels[p][2];
      sums[c][3]++;
    }
    centroids = sums.map((s) =>
      s[3] > 0 ? [Math.round(s[0] / s[3]), Math.round(s[1] / s[3]), Math.round(s[2] / s[3])] : centroids[0],
    );
  }

  const counts = new Array(k).fill(0);
  for (const a of assignments) counts[a]++;

  return centroids
    .map((c, i) => ({
      hex: `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`,
      rgb: c as [number, number, number],
      count: counts[i],
    }))
    .sort((a, b) => b.count - a.count);
}

export default function PalettePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { deduct, credits, dailyFreeRemaining } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setColors([]);
    setError("");
    setPreview(URL.createObjectURL(f));
  }, []);

  async function handleExtract() {
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("palette");
      if (!ok) { router.push("/pricing"); return; }

      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      const maxDim = 200;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setColors(kMeansColors(imageData, 8));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setProcessing(false);
    }
  }

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setColors([]);
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Color Palette Extractor</h1>
              <p className="text-sm text-muted-foreground">Extract dominant colors from any image</p>
            </div>
          </div>
          <UsageBadge credits={credits} dailyFreeRemaining={dailyFreeRemaining} />
        </div>

        {!file ? (
          <ImageDropzone onFile={handleFile} />
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Image" className="mx-auto mb-4 max-h-64 rounded-lg object-contain" />
              <div className="flex gap-3">
                <Button onClick={handleExtract} disabled={processing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Extracting…</> : "Extract Colors"}
                </Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {colors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
                <p className="mb-4 text-sm font-medium text-muted-foreground">Dominant Colors</p>
                <div className="grid gap-3 sm:grid-cols-4">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => copyHex(c.hex)}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-border p-3 transition-colors hover:border-primary/40"
                    >
                      <div className="h-16 w-full rounded-lg" style={{ backgroundColor: c.hex }} />
                      <div className="flex items-center gap-1 text-xs font-mono">
                        {c.hex.toUpperCase()}
                        {copied === c.hex ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        rgb({c.rgb.join(", ")})
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
