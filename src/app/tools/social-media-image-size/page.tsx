"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { Download, ImageIcon, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageDropzone from "@/components/ImageDropzone";
import UsageBadge from "@/components/UsageBadge";
import { useUsage } from "@/hooks/useUsage";
import { SOCIAL_PRESETS } from "@/lib/image-tools/social-presets";
import { resizeToPreset, type OutputFormat } from "@/lib/image-tools/transform";

export default function SocialMediaImageSizePage() {
  const { deduct, credits } = useUsage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [presetId, setPresetId] = useState<string>(SOCIAL_PRESETS[0].id);
  const [custom, setCustom] = useState(false);
  const [width, setWidth] = useState(String(SOCIAL_PRESETS[0].width));
  const [height, setHeight] = useState(String(SOCIAL_PRESETS[0].height));
  const [mode, setMode] = useState<"cover" | "contain">("cover");
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

  const handleFile = useCallback((nextFile: File) => {
    setResult(null);
    setError("");
    if (nextFile.size > 20 * 1024 * 1024) {
      setFile(null);
      setPreview(null);
      setError("Please choose an image under 20 MB.");
      return;
    }
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  }, []);

  function selectPreset(id: string) {
    setPresetId(id);
    setCustom(false);
    const preset = SOCIAL_PRESETS.find((item) => item.id === id) || SOCIAL_PRESETS[0];
    setWidth(String(preset.width));
    setHeight(String(preset.height));
  }

  async function handleResize() {
    if (!file) return;
    const targetWidth = Number(width);
    const targetHeight = Number(height);
    if (!Number.isInteger(targetWidth) || !Number.isInteger(targetHeight) || targetWidth < 1 || targetHeight < 1 || targetWidth > 12000 || targetHeight > 12000) {
      setError("Use dimensions between 1 and 12,000 pixels.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      if (!(await deduct("resize"))) throw new Error("This tool is currently unavailable.");
      const blob = await resizeToPreset(file, targetWidth, targetHeight, mode, format);
      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Resize failed");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20"><ImageIcon className="h-5 w-5" /></div><div><h1 className="text-2xl font-bold">Social Media Image Sizes and Presets</h1><p className="text-sm text-muted-foreground">Crop or fit images for Instagram, YouTube, Facebook, and more.</p></div></div>
        <UsageBadge credits={credits} />
      </div>
      {!file ? <ImageDropzone onFile={handleFile} /> : (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            {preview && <img src={preview} alt="Image for social media resizing" className="mx-auto mb-5 max-h-72 rounded-lg object-contain" />}
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="social-preset">Platform preset</Label><select id="social-preset" value={custom ? "custom" : presetId} onChange={(event) => event.target.value === "custom" ? setCustom(true) : selectPreset(event.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="custom">Custom dimensions</option>{SOCIAL_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.label} ({preset.width} × {preset.height})</option>)}</select></div>
              <div><Label>Output mode</Label><div className="mt-1 flex gap-2"><button onClick={() => setMode("cover")} className={`rounded-lg px-3 py-2 text-sm ${mode === "cover" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Cover crop</button><button onClick={() => setMode("contain")} className={`rounded-lg px-3 py-2 text-sm ${mode === "contain" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Fit with padding</button></div></div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><Label htmlFor="social-width">Width</Label><Input id="social-width" value={width} onChange={(event) => { setCustom(true); setWidth(event.target.value.replace(/\D/g, "")); }} inputMode="numeric" /></div><div><Label htmlFor="social-height">Height</Label><Input id="social-height" value={height} onChange={(event) => { setCustom(true); setHeight(event.target.value.replace(/\D/g, "")); }} inputMode="numeric" /></div></div>
            <div className="mt-4 flex flex-wrap gap-2">{([['image/jpeg', 'JPG'], ['image/png', 'PNG']] as const).map(([value, label]) => <button key={value} onClick={() => setFormat(value)} className={`rounded-lg px-3 py-2 text-sm ${format === value ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{label}</button>)}</div>
            <div className="mt-5 flex gap-3"><Button onClick={handleResize} disabled={processing} className="flex-1">{processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Preparing image…</> : "Resize image"}</Button><Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /></Button></div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <a href={result} download={`social-image.${format === "image/jpeg" ? "jpg" : "png"}`}><Button className="gap-2"><Download className="h-4 w-4" />Download resized image</Button></a>}
        </div>
      )}
    </div>
  );
}
