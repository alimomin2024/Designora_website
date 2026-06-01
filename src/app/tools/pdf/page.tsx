"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileImage, Download, RotateCcw, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import UsageBadge from "@/components/UsageBadge";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";

type Mode = "pdf-to-image" | "image-to-pdf";

export default function PdfPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { deduct, credits, dailyFreeRemaining } = useUsage();

  const [mode, setMode] = useState<Mode>("pdf-to-image");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [pdfResult, setPdfResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePdfFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setPdfFile(f); setResults([]); setError(""); }
  }, []);

  const handleImageFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setImageFiles(selected);
    setPdfResult(null);
    setError("");
  }, []);

  async function handlePdfToImage() {
    if (!pdfFile) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("pdf");
      if (!ok) { router.push("/pricing"); return; }

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const urls: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed"))), "image/png"),
        );
        urls.push(URL.createObjectURL(blob));
      }

      setResults(urls);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "PDF conversion failed");
    } finally {
      setProcessing(false);
    }
  }

  async function handleImageToPdf() {
    if (!imageFiles.length) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("pdf");
      if (!ok) { router.push("/pricing"); return; }

      const { jsPDF } = await import("jspdf");

      let doc: InstanceType<typeof jsPDF> | null = null;

      for (let i = 0; i < imageFiles.length; i++) {
        const img = new Image();
        const url = URL.createObjectURL(imageFiles[i]);
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = url;
        });

        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const orientation = w > h ? "landscape" : "portrait";

        if (i === 0) {
          doc = new jsPDF({ orientation, unit: "px", format: [w, h] });
        } else {
          doc!.addPage([w, h], orientation);
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        doc!.addImage(dataUrl, "JPEG", 0, 0, w, h);
      }

      if (doc) {
        const blob = doc.output("blob");
        setPdfResult(URL.createObjectURL(blob));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "PDF creation failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setPdfFile(null);
    setImageFiles([]);
    setResults([]);
    setPdfResult(null);
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
              <FileImage className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PDF ↔ Image</h1>
              <p className="text-sm text-muted-foreground">Convert PDF to images or images to PDF</p>
            </div>
          </div>
          <UsageBadge credits={credits} dailyFreeRemaining={dailyFreeRemaining} />
        </div>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => { setMode("pdf-to-image"); reset(); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "pdf-to-image" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            PDF → Image
          </button>
          <button
            onClick={() => { setMode("image-to-pdf"); reset(); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "image-to-pdf" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            Image → PDF
          </button>
        </div>

        {mode === "pdf-to-image" ? (
          <div className="space-y-6">
            {!pdfFile ? (
              <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 transition-all hover:border-primary/40 hover:bg-primary/5">
                <input type="file" accept=".pdf" onChange={handlePdfFile} className="sr-only" />
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-medium">Upload a PDF file</p>
              </label>
            ) : (
              <div className="glass rounded-2xl p-6 space-y-4">
                <p className="text-sm text-muted-foreground">{pdfFile.name}</p>
                <div className="flex gap-3">
                  <Button onClick={handlePdfToImage} disabled={processing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting…</> : "Convert to Images"}
                  </Button>
                  <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
                <p className="mb-4 text-sm font-medium text-muted-foreground">{results.length} page{results.length > 1 ? "s" : ""}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {results.map((url, i) => (
                    <div key={i} className="space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Page ${i + 1}`} className="rounded-lg border border-border w-full" />
                      <a href={url} download={`page-${i + 1}.png`}>
                        <Button size="sm" variant="outline" className="w-full gap-1">
                          <Download className="h-3 w-3" /> Page {i + 1}
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {imageFiles.length === 0 ? (
              <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 transition-all hover:border-primary/40 hover:bg-primary/5">
                <input type="file" accept="image/*" multiple onChange={handleImageFiles} className="sr-only" />
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-medium">Select images to combine into PDF</p>
              </label>
            ) : (
              <div className="glass rounded-2xl p-6 space-y-4">
                <p className="text-sm text-muted-foreground">{imageFiles.length} image{imageFiles.length > 1 ? "s" : ""} selected</p>
                <div className="flex gap-3">
                  <Button onClick={handleImageToPdf} disabled={processing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating PDF…</> : "Create PDF"}
                  </Button>
                  <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {pdfResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <a href={pdfResult} download="images.pdf">
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                </a>
              </motion.div>
            )}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </motion.div>
    </div>
  );
}
