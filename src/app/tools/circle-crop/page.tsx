"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, ZoomIn, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";

export default function CircleCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setImgElement(img);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    };
    img.src = url;
  }, []);

  const renderCircleCrop = useCallback(async () => {
    if (!imgElement) return;

    const dim = Math.min(imgElement.naturalWidth, imgElement.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, dim, dim);

    // Save state for circular clipping
    ctx.save();
    ctx.beginPath();
    ctx.arc(dim / 2, dim / 2, dim / 2 - borderWidth, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Source coordinates adjusted for zoom and pan
    const cropSize = dim / zoom;
    const sx = (imgElement.naturalWidth - cropSize) / 2 + panX;
    const sy = (imgElement.naturalHeight - cropSize) / 2 + panY;

    ctx.drawImage(imgElement, sx, sy, cropSize, cropSize, 0, 0, dim, dim);
    ctx.restore();

    // Draw optional border
    if (borderWidth > 0) {
      ctx.beginPath();
      ctx.arc(dim / 2, dim / 2, dim / 2 - borderWidth / 2, 0, Math.PI * 2);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), "image/png"),
    );
    setResultUrl(URL.createObjectURL(blob));
  }, [imgElement, zoom, panX, panY, borderWidth, borderColor]);

  useEffect(() => {
    if (imgElement) {
      void renderCircleCrop();
    }
  }, [imgElement, zoom, panX, panY, borderWidth, borderColor, renderCircleCrop]);

  function handleReset() {
    setFile(null);
    setImgElement(null);
    setResultUrl(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Transparent Round Profile Picture Generator
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Circle Crop Image Online Free
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Crop images into a perfect circle with a transparent PNG background. Ideal for LinkedIn, Discord, Instagram, WhatsApp, and Slack profile pictures.
        </p>
      </div>

      {!file ? (
        <ImageDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Controls Bar */}
          <div className="glass rounded-2xl p-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <span>Zoom & Crop</span>
                <span className="text-primary font-bold">{zoom.toFixed(1)}x</span>
              </label>
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Circle Border
              </label>
              <div className="flex items-center gap-2">
                {[
                  { label: "None", w: 0 },
                  { label: "Thin", w: 6 },
                  { label: "Medium", w: 12 },
                  { label: "Thick", w: 20 },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => setBorderWidth(b.w)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      borderWidth === b.w
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:border-primary/40"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="glass rounded-2xl p-8 border border-primary/30 flex flex-col items-center justify-center text-center">
            <div className="relative p-6 rounded-2xl bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]">
              {resultUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resultUrl}
                  alt="Circle Crop Preview"
                  className="h-64 w-64 rounded-full object-cover shadow-2xl"
                />
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Background is 100% transparent PNG · Ready to use as an avatar
            </p>

            {resultUrl && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Crop Another Photo
                </Button>
                <a href={resultUrl} download={`circle_${file.name.replace(/\.[^.]+$/, "")}.png`}>
                  <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Download className="h-4 w-4" />
                    Download Round PNG
                  </Button>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
