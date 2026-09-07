"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { Download, FileImage, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useUsage } from "@/hooks/useUsage";
import { resizeToPreset } from "@/lib/image-tools/transform";

type OutputFormat = "image/jpeg" | "image/png";

function isHeicFile(file: File) {
  return /\.(heic|heif)$/i.test(file.name) || /image\/(heic|heif)/i.test(file.type);
}

async function decodeHeic(file: File): Promise<Blob> {
  const heicModule = await import("heic2any");
  const converted = await heicModule.default({ blob: file, toType: "image/png" });
  return Array.isArray(converted) ? converted[0] : converted;
}

export default function HeicToJpgPage() {
  const { deduct, credits } = useUsage();
  const [file, setFile] = useState<File | null>(null);
  const [decoded, setDecoded] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result);
    };
  }, [result]);

  const handleFile = useCallback(async (nextFile: File) => {
    setFile(null);
    setDecoded(null);
    setResult(null);
    setError("");
    if (nextFile.size > 20 * 1024 * 1024) {
      setError("Please choose a HEIC or HEIF file under 20 MB.");
      return;
    }
    if (!isHeicFile(nextFile)) {
      setError("Please choose a HEIC or HEIF photo.");
      return;
    }
    try {
      const converted = await decodeHeic(nextFile);
      setFile(nextFile);
      setDecoded(converted);
      setPreview(URL.createObjectURL(converted));
    } catch {
      setError("This HEIC file could not be decoded. Try another photo or export it from your device as JPG.");
    }
  }, []);

  async function handleConvert() {
    if (!decoded) return;
    setProcessing(true);
    setError("");
    try {
      if (!(await deduct("convert"))) throw new Error("This tool is currently unavailable.");
      const { width, height } = await getImageDimensions(decoded);
      const blob = await resizeToPreset(decoded, width, height, "contain", format);
      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setDecoded(null);
    setPreview(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20"><FileImage className="h-5 w-5" /></div>
          <div>
            <h1 className="text-2xl font-bold">HEIC to JPG or PNG Converter</h1>
            <p className="text-sm text-muted-foreground">Convert iPhone photos locally in your browser.</p>
          </div>
        </div>
        <UsageBadge credits={credits} />
      </div>

      {!file ? (
        <ImageDropzone accept="image/*,.heic,.heif" onFile={handleFile}>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"><FileImage className="h-7 w-7 text-primary" /></div>
          <p className="text-sm font-medium">Drop a HEIC or HEIF photo, or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">HEIC, HEIF up to 20 MB · local browser processing</p>
        </ImageDropzone>
      ) : (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            {preview ? <img src={preview} alt="Decoded HEIC preview" className="mx-auto mb-5 max-h-72 rounded-lg object-contain" /> : null}
            <p className="text-sm text-muted-foreground">{file.name}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {(["image/jpeg", "image/png"] as const).map((value) => (
                <button key={value} onClick={() => setFormat(value)} className={`rounded-lg px-4 py-2 text-sm font-medium ${format === value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  Convert to {value === "image/jpeg" ? "JPG" : "PNG"}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <Button onClick={handleConvert} disabled={processing} className="flex-1">
                {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting…</> : "Convert photo"}
              </Button>
              <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <a href={result} download={`converted.${format === "image/jpeg" ? "jpg" : "png"}`}><Button className="gap-2"><Download className="h-4 w-4" />Download {format === "image/jpeg" ? "JPG" : "PNG"}</Button></a>}
        </div>
      )}
    </div>
  );
}

async function getImageDimensions(blob: Blob) {
  const img = new Image();
  const url = URL.createObjectURL(blob);
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to read image dimensions"));
      img.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}
