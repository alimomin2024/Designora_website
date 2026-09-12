"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Download, RotateCcw, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PdfToJpgPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");

  const handlePdfUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPdfFile(f);
    setPages([]);
    setError("");
    setProcessing(true);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const totalPages = pdf.numPages;
      setProgress({ current: 0, total: totalPages });

      const pageUrls: string[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProgress({ current: i, total: totalPages });
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;

        // Fill white background for JPEG rendering
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render PDF page to canvas
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page.render({ canvasContext: ctx, viewport } as any)).promise;

        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed to render page"))), "image/jpeg", 0.9),
        );
        pageUrls.push(URL.createObjectURL(blob));
      }

      setPages(pageUrls);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to extract PDF pages");
    } finally {
      setProcessing(false);
    }
  }, []);

  function handleReset() {
    setPdfFile(null);
    setPages([]);
    setError("");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          High-Resolution PDF to JPG Converter (In-Browser)
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          PDF to JPG Converter Free Online
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Convert PDF documents into high-quality JPG images. Extract every page as a sharp JPEG photo with zero file uploads to external servers.
        </p>
      </div>

      <div className="space-y-6">
        {!pdfFile ? (
          <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 transition-all hover:border-primary/40 hover:bg-primary/5">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="sr-only"
            />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-medium">Click to select PDF document, or drag and drop</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF files up to 50 MB</p>
          </label>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm">{pdfFile.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {(pdfFile.size / 1024).toFixed(1)} KB · {pages.length} {pages.length === 1 ? "page" : "pages"} converted
                </p>
              </div>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Convert Another PDF
              </Button>
            </div>

            {processing && (
              <div className="glass rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">
                  Converting page {progress.current} of {progress.total}...
                </p>
                <p className="text-xs text-muted-foreground">Rendering pages locally at high 2× resolution</p>
              </div>
            )}

            {pages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Converted Pages ({pages.length})
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {pages.map((url, i) => (
                    <div key={i} className="glass rounded-2xl p-4 border border-border/70 flex flex-col items-center">
                      <div className="relative w-full aspect-[3/4] bg-white rounded-xl overflow-hidden border border-border/40 shadow-sm flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Page ${i + 1}`} className="max-h-full max-w-full object-contain" />
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                          Page {i + 1}
                        </span>
                      </div>
                      <a href={url} download={`${pdfFile.name.replace(/\.[^.]+$/, "")}_page_${i + 1}.jpg`} className="w-full mt-3">
                        <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                          <Download className="h-3.5 w-3.5" />
                          Download Page {i + 1} (JPG)
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
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
