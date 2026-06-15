"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Droplets, Download, RotateCcw, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";

export default function WatermarkRemovalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { deduct, credits } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [brushSize, setBrushSize] = useState(20);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);
  const painting = useRef(false);
  const [canvasDims, setCanvasDims] = useState({ w: 0, h: 0 });
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");

    const img = new Image();
    img.onload = () => {
      setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });

      const maxW = 800;
      const scale = img.naturalWidth > maxW ? maxW / img.naturalWidth : 1;
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      setCanvasDims({ w, h });

      requestAnimationFrame(() => {
        const cv = canvasRef.current;
        const mk = maskRef.current;
        const im = imageRef.current;
        if (!cv || !mk || !im) return;

        cv.width = w;
        cv.height = h;
        mk.width = w;
        mk.height = h;
        im.width = w;
        im.height = h;

        const ctx = cv.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);

        const imCtx = im.getContext("2d")!;
        imCtx.drawImage(img, 0, 0, w, h);

        const mkCtx = mk.getContext("2d")!;
        mkCtx.clearRect(0, 0, w, h);
      });
    };
    img.src = URL.createObjectURL(f);
  }, []);

  function getCanvasPos(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasDims.w / rect.width;
    const scaleY = canvasDims.h / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function paintAt(x: number, y: number) {
    const cv = canvasRef.current;
    const mk = maskRef.current;
    if (!cv || !mk) return;

    const ctx = cv.getContext("2d")!;
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#ff0066";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const mkCtx = mk.getContext("2d")!;
    mkCtx.fillStyle = "#ffffff";
    mkCtx.beginPath();
    mkCtx.arc(x, y, brushSize, 0, Math.PI * 2);
    mkCtx.fill();
  }

  function handlePointerDown(e: React.PointerEvent) {
    painting.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { x, y } = getCanvasPos(e);
    paintAt(x, y);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!painting.current) return;
    const { x, y } = getCanvasPos(e);
    paintAt(x, y);
  }

  function handlePointerUp() {
    painting.current = false;
  }

  async function handleInpaint() {
    if (!file || !maskRef.current) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("watermark");
      if (!ok) {
        router.push("/pricing");
        return;
      }

      const fullMaskCanvas = document.createElement("canvas");
      fullMaskCanvas.width = origDims.w;
      fullMaskCanvas.height = origDims.h;
      const fmCtx = fullMaskCanvas.getContext("2d")!;
      fmCtx.fillStyle = "#000000";
      fmCtx.fillRect(0, 0, origDims.w, origDims.h);
      fmCtx.drawImage(maskRef.current, 0, 0, origDims.w, origDims.h);

      const maskBlob = await new Promise<Blob>((res, rej) =>
        fullMaskCanvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed"))), "image/png"),
      );

      const formData = new FormData();
      formData.append("image", file);
      formData.append("mask", maskBlob, "mask.png");
      formData.append("width", String(origDims.w));
      formData.append("height", String(origDims.h));

      const res = await fetch("/api/watermark-remove", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Watermark removal failed");
      setResult(data.imageURL);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Inpainting failed");
    } finally {
      setProcessing(false);
    }
  }

  function clearMask() {
    const cv = canvasRef.current;
    const mk = maskRef.current;
    const im = imageRef.current;
    if (!cv || !mk || !im) return;

    const ctx = cv.getContext("2d")!;
    ctx.drawImage(im, 0, 0);

    const mkCtx = mk.getContext("2d")!;
    mkCtx.clearRect(0, 0, canvasDims.w, canvasDims.h);
  }

  function reset() {
    setFile(null);
    setResult(null);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Watermark Removal</h1>
              <p className="text-sm text-muted-foreground">
                Paint over the watermark, then let AI fill it in
              </p>
            </div>
          </div>
          <UsageBadge credits={credits} />
        </div>

        {!file ? (
          <ImageDropzone onFile={handleFile} />
        ) : result ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground uppercase">Result</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result}
                alt="Result"
                className="mx-auto max-h-[500px] rounded-lg object-contain"
              />
            </div>
            <div className="flex gap-3">
              <a href={result} download="watermark-removed.png">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </a>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> New Image
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Paint over the watermark area with your mouse or finger
              </p>

              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Brush:</span>
                <button
                  onClick={() => setBrushSize(Math.max(5, brushSize - 5))}
                  className="rounded-lg bg-secondary p-1.5 hover:bg-secondary/80"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm">{brushSize}</span>
                <button
                  onClick={() => setBrushSize(Math.min(60, brushSize + 5))}
                  className="rounded-lg bg-secondary p-1.5 hover:bg-secondary/80"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={clearMask}
                  className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear mask
                </button>
              </div>

              <div className="relative mx-auto overflow-hidden rounded-lg border border-border"
                style={{ maxWidth: canvasDims.w, touchAction: "none" }}
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="block w-full cursor-crosshair"
                />
                <canvas ref={maskRef} className="hidden" />
                <canvas ref={imageRef} className="hidden" />
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleInpaint}
                  disabled={processing}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inpainting…
                    </>
                  ) : (
                    "Remove Watermark"
                  )}
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
