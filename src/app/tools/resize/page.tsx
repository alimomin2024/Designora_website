"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Maximize, Download, RotateCcw, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useUsage } from "@/hooks/useUsage";
import { resizeImage, getImageDimensions } from "@/lib/image-tools/resize";

export default function ResizePage() {
  const { deduct, credits } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [widthInput, setWidthInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [resultDims, setResultDims] = useState<{ width: number; height: number } | null>(null);
  const [linked, setLinked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setPreview(URL.createObjectURL(f));
    const dims = await getImageDimensions(f);
    setOrigW(dims.width);
    setOrigH(dims.height);
    setWidthInput(String(dims.width));
    setHeightInput(String(dims.height));
  }, []);

  const handleWidthChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    setWidthInput(cleaned);
    if (linked && origW > 0 && cleaned) {
      const v = Number(cleaned);
      setHeightInput(String(Math.round((v / origW) * origH)));
    }
  };

  const handleHeightChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    setHeightInput(cleaned);
    if (linked && origH > 0 && cleaned) {
      const v = Number(cleaned);
      setWidthInput(String(Math.round((v / origH) * origW)));
    }
  };

  async function handleResize() {
    if (!file) return;
    const width = Number(widthInput);
    const height = Number(heightInput);
    if (!width || !height || width < 1 || height < 1) {
      setError("Please enter valid width and height values.");
      return;
    }
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("resize");
      if (!ok) {
        throw new Error("This tool is currently unavailable.");
      }
      const blob = await resizeImage(file, { width, height });
      setResult(URL.createObjectURL(blob));
      setResultDims({ width, height });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Resize failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setWidthInput("");
    setHeightInput("");
    setResultDims(null);
    setOrigW(0);
    setOrigH(0);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <Maximize className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resize Image Online</h1>
              <p className="text-sm text-muted-foreground">Resize to any dimensions</p>
            </div>
          </div>
          <UsageBadge credits={credits} />
        </div>

        {!file ? (
          <ImageDropzone onFile={handleFile} />
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">Original</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview!}
                    alt="Original"
                    className="max-h-64 rounded-lg object-contain"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {origW} &times; {origH}px
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor="w">Width (px)</Label>
                      <Input
                        id="w"
                        type="text"
                        inputMode="numeric"
                        value={widthInput}
                        onChange={(e) => handleWidthChange(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => setLinked(!linked)}
                      className={`mb-0.5 rounded-lg p-2 transition-colors ${
                        linked
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                      title="Lock aspect ratio"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor="h">Height (px)</Label>
                      <Input
                        id="h"
                        type="text"
                        inputMode="numeric"
                        value={heightInput}
                        onChange={(e) => handleHeightChange(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleResize}
                      disabled={processing || !widthInput || !heightInput}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {processing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Resize"
                      )}
                    </Button>
                    <Button variant="outline" onClick={reset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase">Result</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result}
                  alt="Resized"
                  className="max-h-80 rounded-lg object-contain"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {resultDims?.width ?? widthInput} &times; {resultDims?.height ?? heightInput}px
                </p>
                <a href={result} download="resized.png">
                  <Button className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
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
