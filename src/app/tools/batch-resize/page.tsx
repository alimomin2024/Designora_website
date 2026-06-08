"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Layers, Download, RotateCcw, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UsageBadge from "@/components/UsageBadge";
import { useUsage } from "@/hooks/useUsage";

export default function BatchResizePage() {
  const { deduct, credits, dailyFreeRemaining } = useUsage();

  const [files, setFiles] = useState<File[]>([]);
  const [widthInput, setWidthInput] = useState("800");
  const [heightInput, setHeightInput] = useState("600");
  const [results, setResults] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setResults([]);
    setError("");
  }, []);

  async function resizeOne(file: File, w: number, h: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error("Failed"))),
          "image/png",
        );
      };
      img.onerror = () => reject(new Error("Failed to load"));
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleBatchResize() {
    if (!files.length) return;
    const width = Number(widthInput);
    const height = Number(heightInput);
    if (!width || !height || width < 1 || height < 1) {
      setError("Please enter valid width and height values.");
      return;
    }
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("batchResize");
      if (!ok) throw new Error("This tool is currently unavailable.");

      const urls: string[] = [];
      for (const f of files) {
        const url = await resizeOne(f, width, height);
        urls.push(url);
      }
      setResults(urls);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Batch resize failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFiles([]);
    setResults([]);
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Batch Resize</h1>
              <p className="text-sm text-muted-foreground">Resize multiple images at once</p>
            </div>
          </div>
          <UsageBadge credits={credits} dailyFreeRemaining={dailyFreeRemaining} />
        </div>

        {files.length === 0 ? (
          <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 transition-all hover:border-primary/40 hover:bg-primary/5">
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="sr-only" />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-medium">Select multiple images</p>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP</p>
          </label>
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <p className="mb-4 text-sm text-muted-foreground">{files.length} image{files.length > 1 ? "s" : ""} selected</p>
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div className="space-y-1.5">
                  <Label>Width (px)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={widthInput}
                    onChange={(e) => setWidthInput(e.target.value.replace(/[^\d]/g, ""))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Height (px)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value.replace(/[^\d]/g, ""))}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleBatchResize}
                  disabled={processing || !widthInput || !heightInput}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resizing…</> : `Resize ${files.length} Images`}
                </Button>
                <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
                <p className="mb-4 text-sm font-medium text-muted-foreground">Results</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {results.map((url, i) => (
                    <div key={i} className="space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Resized ${i + 1}`} className="rounded-lg border border-border w-full" />
                      <a href={url} download={`resized-${i + 1}.png`}>
                        <Button size="sm" variant="outline" className="w-full gap-1">
                          <Download className="h-3 w-3" /> Download
                        </Button>
                      </a>
                    </div>
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
