"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { Crop, Download, Loader2, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useUsage } from "@/hooks/useUsage";
import { cropRotateImage, type OutputFormat } from "@/lib/image-tools/transform";
import { getImageDimensions } from "@/lib/image-tools/resize";

export default function CropRotatePage() {
  const { deduct, credits } = useUsage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [format, setFormat] = useState<OutputFormat>("image/png");
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
    setResult(null);
    setError("");
    if (nextFile.size > 20 * 1024 * 1024) {
      setFile(null);
      setPreview(null);
      setError("Please choose an image under 20 MB.");
      return;
    }
    try {
      const imageDims = await getImageDimensions(nextFile);
      setFile(nextFile);
      setPreview(URL.createObjectURL(nextFile));
      setDims({ width: imageDims.width, height: imageDims.height });
      setCrop({ x: 0, y: 0, width: imageDims.width, height: imageDims.height });
      setRotation(0);
    } catch {
      setFile(null);
      setPreview(null);
      setError("This image could not be read. Try a JPG, PNG, or WEBP file.");
    }
  }, []);

  function updateCrop(key: keyof typeof crop, value: string) {
    setCrop((current) => ({ ...current, [key]: Math.max(0, Number(value.replace(/\D/g, "")) || 0) }));
  }

  async function handleExport() {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      if (!(await deduct("resize"))) throw new Error("This tool is currently unavailable.");
      const blob = await cropRotateImage(file, {
        cropX: crop.x,
        cropY: crop.y,
        cropWidth: crop.width,
        cropHeight: crop.height,
        rotation,
        format,
      });
      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Crop failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20"><Crop className="h-5 w-5" /></div><div><h1 className="text-2xl font-bold">Crop and Rotate Images Online</h1><p className="text-sm text-muted-foreground">Set a crop box and rotate JPG, PNG, or WEBP photos.</p></div></div>
        <UsageBadge credits={credits} />
      </div>
      {!file ? <ImageDropzone onFile={handleFile} /> : (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            {preview && <img src={preview} alt="Image to crop" className="mx-auto mb-5 max-h-72 rounded-lg object-contain" />}
            <p className="mb-4 text-xs text-muted-foreground">Original: {dims.width} × {dims.height} px. Crop coordinates use the original image pixels.</p>
            <div className="grid gap-4 sm:grid-cols-4">
              {([['x', 'Left'], ['y', 'Top'], ['width', 'Width'], ['height', 'Height']] as const).map(([key, label]) => <div key={key}><Label htmlFor={`crop-${key}`}>{label}</Label><Input id={`crop-${key}`} value={crop[key]} onChange={(event) => updateCrop(key, event.target.value)} inputMode="numeric" /></div>)}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setRotation((value) => ((value + 270) % 360) as 0 | 90 | 180 | 270)}><RotateCcw className="mr-2 h-4 w-4" />Rotate left</Button>
              <Button variant="outline" onClick={() => setRotation((value) => ((value + 90) % 360) as 0 | 90 | 180 | 270)}><RotateCw className="mr-2 h-4 w-4" />Rotate right</Button>
              <span className="self-center text-sm text-muted-foreground">Rotation: {rotation}°</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {([['image/png', 'PNG'], ['image/jpeg', 'JPG']] as const).map(([value, label]) => <button key={value} onClick={() => setFormat(value)} className={`rounded-lg px-4 py-2 text-sm font-medium ${format === value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{label}</button>)}
              <Button onClick={handleExport} disabled={processing} className="ml-auto">{processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporting…</> : "Crop and download"}</Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <a href={result} download={`cropped-image.${format === "image/png" ? "png" : "jpg"}`}><Button className="gap-2"><Download className="h-4 w-4" />Download result</Button></a>}
        </div>
      )}
    </div>
  );
}
