"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, FlipHorizontal, FlipVertical, RotateCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";

export default function FlipImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setImgElement(img);
      setFlipH(false);
      setFlipV(false);
      setRotation(0);
    };
    img.src = url;
  }, []);

  const renderFlippedImage = useCallback(async () => {
    if (!imgElement) return;

    const canvas = document.createElement("canvas");
    const rad = (rotation * Math.PI) / 180;
    const isSideways = rotation % 180 !== 0;

    canvas.width = isSideways ? imgElement.naturalHeight : imgElement.naturalWidth;
    canvas.height = isSideways ? imgElement.naturalWidth : imgElement.naturalHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imgElement, -imgElement.naturalWidth / 2, -imgElement.naturalHeight / 2);

    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), "image/png"),
    );
    setResultUrl(URL.createObjectURL(blob));
  }, [imgElement, flipH, flipV, rotation]);

  useEffect(() => {
    if (imgElement) {
      void renderFlippedImage();
    }
  }, [imgElement, flipH, flipV, rotation, renderFlippedImage]);

  function handleReset() {
    setFile(null);
    setImgElement(null);
    setResultUrl(null);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Mirror & Invert Image Online (In-Browser)
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Flip Image Online Free
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Flip images horizontally (mirror effect) or vertically (upside-down). Fast, lossless, and 100% private in your browser.
        </p>
      </div>

      {!file ? (
        <ImageDropzone onFile={handleFile} accept="image/*" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Action Buttons */}
          <div className="glass rounded-2xl p-5 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant={flipH ? "default" : "outline"}
              onClick={() => setFlipH((v) => !v)}
              className="gap-2"
            >
              <FlipHorizontal className="h-4 w-4" />
              Flip Horizontally {flipH ? "(On)" : ""}
            </Button>
            <Button
              variant={flipV ? "default" : "outline"}
              onClick={() => setFlipV((v) => !v)}
              className="gap-2"
            >
              <FlipVertical className="h-4 w-4" />
              Flip Vertically {flipV ? "(On)" : ""}
            </Button>
            <Button
              variant="outline"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Rotate 90°
            </Button>
          </div>

          {/* Preview Card */}
          <div className="glass rounded-2xl p-6 border border-primary/30 flex flex-col items-center justify-center text-center">
            <div className="relative aspect-video max-h-96 w-full rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center p-4">
              {resultUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resultUrl}
                  alt="Flipped Preview"
                  className="max-h-full max-w-full object-contain rounded shadow"
                />
              )}
            </div>

            {resultUrl && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Flip Another Image
                </Button>
                <a href={resultUrl} download={`flipped_${file.name}`}>
                  <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Download className="h-4 w-4" />
                    Download Flipped Image
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
