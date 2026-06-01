"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Download, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";

interface MetadataInfo {
  width: number;
  height: number;
  type: string;
  size: number;
}

export default function MetadataPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { deduct, credits, dailyFreeRemaining } = useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<MetadataInfo | null>(null);
  const [dpi, setDpi] = useState(300);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setPreview(URL.createObjectURL(f));

    const img = new Image();
    img.onload = () => {
      setMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: f.type,
        size: f.size,
      });
    };
    img.src = URL.createObjectURL(f);
  }, []);

  async function handleSetDpi() {
    if (!file || !meta) return;
    setError("");
    setProcessing(true);
    try {
      const ok = await deduct("metadata");
      if (!ok) { router.push("/pricing"); return; }

      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed"))),
          "image/png",
        ),
      );

      const arrayBuf = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);
      const pngWithDpi = setPngDpi(bytes, dpi);
      const finalBlob = new Blob([pngWithDpi.buffer as ArrayBuffer], { type: "image/png" });
      setResult(URL.createObjectURL(finalBlob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to set DPI");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setMeta(null);
    setResult(null);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Metadata / DPI Editor</h1>
              <p className="text-sm text-muted-foreground">View image info and set DPI for print</p>
            </div>
          </div>
          <UsageBadge credits={credits} dailyFreeRemaining={dailyFreeRemaining} />
        </div>

        {!file ? (
          <ImageDropzone onFile={handleFile} />
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview!} alt="Image" className="max-h-64 rounded-lg object-contain" />
                </div>
                <div className="space-y-3">
                  {meta && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Dimensions</span><span>{meta.width} &times; {meta.height} px</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span>{meta.type}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">File Size</span><span>{formatSize(meta.size)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Print Size @ {dpi} DPI</span><span>{(meta.width / dpi).toFixed(1)}&quot; &times; {(meta.height / dpi).toFixed(1)}&quot;</span></div>
                    </div>
                  )}
                  <div className="pt-2 space-y-1.5">
                    <Label>Set DPI</Label>
                    <Input type="number" min={72} max={1200} value={dpi} onChange={(e) => setDpi(Number(e.target.value))} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSetDpi} disabled={processing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : `Save as ${dpi} DPI`}
                    </Button>
                    <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <a href={result} download={`image-${dpi}dpi.png`}>
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Download className="h-4 w-4" /> Download ({dpi} DPI)
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

function setPngDpi(pngBytes: Uint8Array, dpi: number): Uint8Array {
  const ppm = Math.round(dpi / 0.0254);
  const pHYs = new Uint8Array(21);
  const view = new DataView(pHYs.buffer);

  view.setUint32(0, 9);
  pHYs[4] = 0x70; pHYs[5] = 0x48; pHYs[6] = 0x59; pHYs[7] = 0x73;
  view.setUint32(8, ppm);
  view.setUint32(12, ppm);
  pHYs[16] = 1;

  let crc = crc32(pHYs.slice(4, 17));
  view.setUint32(17, crc);

  let ihdrEnd = 8;
  for (let i = 8; i < pngBytes.length - 4;) {
    const len = (pngBytes[i] << 24) | (pngBytes[i + 1] << 16) | (pngBytes[i + 2] << 8) | pngBytes[i + 3];
    const type = String.fromCharCode(pngBytes[i + 4], pngBytes[i + 5], pngBytes[i + 6], pngBytes[i + 7]);
    const chunkTotal = 12 + len;
    if (type === "IHDR") {
      ihdrEnd = i + chunkTotal;
      break;
    }
    i += chunkTotal;
  }

  const result = new Uint8Array(pngBytes.length + pHYs.length);
  result.set(pngBytes.slice(0, ihdrEnd), 0);
  result.set(pHYs, ihdrEnd);
  result.set(pngBytes.slice(ihdrEnd), ihdrEnd + pHYs.length);
  return result;
}

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
