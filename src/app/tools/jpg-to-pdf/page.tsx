"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Download, RotateCcw, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState<"fit" | "a4">("fit");

  const handleFile = useCallback((file: File) => {
    setFiles((prev) => [...prev, file]);
    setPdfUrl(null);
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPdfUrl(null);
  }, []);

  async function convertToPdf() {
    if (!files.length) return;
    setProcessing(true);
    setError("");
    try {
      const { jsPDF } = await import("jspdf");
      let doc: InstanceType<typeof jsPDF> | null = null;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const img = new Image();
        const url = URL.createObjectURL(file);
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = url;
        });

        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        if (pageSize === "a4") {
          // A4 dimensions: 595.28 x 841.89 pt
          const a4W = 595.28;
          const a4H = 841.89;
          const isLandscape = imgW > imgH;
          const targetW = isLandscape ? a4H : a4W;
          const targetH = isLandscape ? a4W : a4H;

          if (i === 0) {
            doc = new jsPDF({ orientation: isLandscape ? "landscape" : "portrait", unit: "pt", format: "a4" });
          } else {
            doc!.addPage("a4", isLandscape ? "landscape" : "portrait");
          }

          // Calculate scale to fit inside margins
          const margin = 20;
          const maxW = targetW - margin * 2;
          const maxH = targetH - margin * 2;
          const ratio = Math.min(maxW / imgW, maxH / imgH);
          const drawW = imgW * ratio;
          const drawH = imgH * ratio;
          const drawX = margin + (maxW - drawW) / 2;
          const drawY = margin + (maxH - drawH) / 2;

          const canvas = document.createElement("canvas");
          canvas.width = imgW;
          canvas.height = imgH;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          doc!.addImage(dataUrl, "JPEG", drawX, drawY, drawW, drawH);
        } else {
          // Fit to image dimensions
          const orientation = imgW > imgH ? "landscape" : "portrait";
          if (i === 0) {
            doc = new jsPDF({ orientation, unit: "px", format: [imgW, imgH] });
          } else {
            doc!.addPage([imgW, imgH], orientation);
          }

          const canvas = document.createElement("canvas");
          canvas.width = imgW;
          canvas.height = imgH;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          doc!.addImage(dataUrl, "JPEG", 0, 0, imgW, imgH);
        }
      }

      if (doc) {
        const blob = doc.output("blob");
        setPdfSize(blob.size);
        setPdfUrl(URL.createObjectURL(blob));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setProcessing(false);
    }
  }

  function handleReset() {
    setFiles([]);
    setPdfUrl(null);
    setPdfSize(0);
    setError("");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Fast In-Browser Image to PDF Converter
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          JPG to PDF Converter Free Online
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Convert JPG, PNG, and WEBP images into clean, professional PDF documents. Combine multiple photos into a single PDF file with zero server uploads.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Zone */}
        <ImageDropzone onFile={handleFile} accept="image/*">
          <div className="text-center">
            <div className="mb-3 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-medium">Click to select images or drag and drop</p>
            <p className="mt-1 text-xs text-muted-foreground">Add one or multiple JPG, PNG, or WEBP photos</p>
          </div>
        </ImageDropzone>

        {/* Selected Images List */}
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="text-sm font-semibold">
                  {files.length} {files.length === 1 ? "Image" : "Images"} Ready
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Page Size:</span>
                  {(["fit", "a4"] as const).map((ps) => (
                    <button
                      key={ps}
                      type="button"
                      onClick={() => setPageSize(ps)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        pageSize === ps
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      {ps === "fit" ? "Fit to Image" : "Standard A4"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {files.map((f, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-border/70 aspect-square bg-muted/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(f)} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-[10px] text-white px-1.5 py-0.5 rounded backdrop-blur">
                      Page {i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Convert Button */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
                <Button onClick={convertToPdf} disabled={processing} className="gap-2 shadow-lg shadow-primary/20">
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Convert to PDF Document
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated PDF Output */}
            {pdfUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 border border-primary/30 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">PDF Ready for Download!</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-5">
                  Combined {files.length} pages · File size: {(pdfSize / 1024).toFixed(1)} KB
                </p>
                <a href={pdfUrl} download="converted_document.pdf" className="inline-flex">
                  <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                    <Download className="h-5 w-5" />
                    Download PDF File
                  </Button>
                </a>
              </motion.div>
            )}
          </motion.div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
