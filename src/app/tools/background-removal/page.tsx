"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eraser, Download, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import BeforeAfter from "@/components/BeforeAfter";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";

export default function BackgroundRemovalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { deduct, credits, dailyFreeRemaining } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setProgress(0);
    setPreview(URL.createObjectURL(f));
  }, []);

  async function handleRemove() {
    if (!file) return;
    setError("");
    setProcessing(true);
    setProgress(0);
    try {
      const ok = await deduct("bgRemoval");
      if (!ok) {
        router.push("/pricing");
        return;
      }
      setProgress(10);
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/bg-remove", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Background removal failed");
      setProgress(80);
      const data = await res.json();
      setProgress(100);
      setResult(data.imageURL);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Background removal failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <Eraser className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Background Removal</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered one-click background removal
              </p>
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
                <img
                  src={preview!}
                  alt="Original"
                  className="mx-auto mb-4 max-h-72 rounded-lg object-contain"
                />

                {processing && (
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Processing with AI model…</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground text-center">
                      Processing with AI...
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleRemove}
                    disabled={processing}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Removing background…
                      </>
                    ) : (
                      "Remove Background"
                    )}
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && preview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <BeforeAfter
                  before={preview}
                  after={result}
                  alt="Background removal"
                />
                <div className="flex gap-3">
                  <a href={result} download="no-background.png">
                    <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </a>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="h-4 w-4" /> New Image
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
