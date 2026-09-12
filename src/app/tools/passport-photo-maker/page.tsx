"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, Printer, CheckCircle2, User, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageDropzone from "@/components/ImageDropzone";

interface Preset {
  id: string;
  name: string;
  country: string;
  wMm: number;
  hMm: number;
  wPx: number;
  hPx: number;
  aspect: number;
  desc: string;
}

const PRESETS: Preset[] = [
  {
    id: "india",
    name: "3.5 × 4.5 cm",
    country: "India Passport, SSC, UPSC, Govt",
    wMm: 35,
    hMm: 45,
    wPx: 413,
    hPx: 531,
    aspect: 35 / 45,
    desc: "Indian Passport, PAN, OCI, and competitive exams",
  },
  {
    id: "us",
    name: "2 × 2 inches (51 × 51 mm)",
    country: "US Passport & Visa, Green Card",
    wMm: 51,
    hMm: 51,
    wPx: 600,
    hPx: 600,
    aspect: 1,
    desc: "US Department of State official visa and passport size",
  },
  {
    id: "schengen",
    name: "35 × 45 mm",
    country: "Schengen Visa & UK Passport",
    wMm: 35,
    hMm: 45,
    wPx: 413,
    hPx: 531,
    aspect: 35 / 45,
    desc: "UK, Canada, Schengen European Union countries",
  },
  {
    id: "signature",
    name: "2 × 4.5 cm",
    country: "Signature / PAN Card Upload",
    wMm: 20,
    hMm: 45,
    wPx: 236,
    hPx: 531,
    aspect: 20 / 45,
    desc: "Standard signature box for Indian government portals",
  },
];

export default function PassportPhotoMakerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [bgColor, setBgColor] = useState<string>("original");
  const [compressUnder50kb, setCompressUnder50kb] = useState(true);

  const [singleResultUrl, setSingleResultUrl] = useState<string | null>(null);
  const [singleFileSize, setSingleFileSize] = useState<number>(0);
  const [sheetResultUrl, setSheetResultUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const renderPassportPhoto = useCallback(async () => {
    if (!imgElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = selectedPreset.wPx;
    canvas.height = selectedPreset.hPx;
    const ctx = canvas.getContext("2d")!;

    // Background fill if requested
    if (bgColor === "white") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgColor === "offwhite") {
      ctx.fillStyle = "#F4F4F5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgColor === "blue") {
      ctx.fillStyle = "#E0F2FE";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Calculate crop and draw
    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const targetAspect = selectedPreset.aspect;

    let sW = imgElement.naturalWidth;
    let sH = imgElement.naturalHeight;

    if (imgAspect > targetAspect) {
      // image is wider than target
      sW = imgElement.naturalHeight * targetAspect;
    } else {
      // image is taller than target
      sH = imgElement.naturalWidth / targetAspect;
    }

    // Apply zoom
    sW /= zoom;
    sH /= zoom;

    const sX = (imgElement.naturalWidth - sW) / 2 + panX;
    const sY = (imgElement.naturalHeight - sH) / 2 + panY;

    ctx.drawImage(imgElement, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height);

    // Compress single photo
    let singleBlob: Blob;
    if (compressUnder50kb) {
      let q = 0.9;
      singleBlob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", q));
      while (singleBlob.size > 50 * 1024 && q > 0.15) {
        q -= 0.1;
        singleBlob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", q));
      }
    } else {
      singleBlob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.95));
    }

    setSingleFileSize(singleBlob.size);
    setSingleResultUrl(URL.createObjectURL(singleBlob));

    // Render 6-photo print sheet (4x6 inch = 1200x1800 px at 300 DPI)
    const sheetCanvas = document.createElement("canvas");
    sheetCanvas.width = 1800; // 6 inches
    sheetCanvas.height = 1200; // 4 inches
    const sCtx = sheetCanvas.getContext("2d")!;

    sCtx.fillStyle = "#FFFFFF";
    sCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // 2 rows of 3 photos
    const pW = selectedPreset.wPx;
    const pH = selectedPreset.hPx;
    const cols = 3;
    const rows = 2;
    const marginX = (sheetCanvas.width - cols * pW) / (cols + 1);
    const marginY = (sheetCanvas.height - rows * pH) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = marginX + c * (pW + marginX);
        const y = marginY + r * (pH + marginY);
        // Draw delicate cutting border
        sCtx.strokeStyle = "#E2E8F0";
        sCtx.lineWidth = 1;
        sCtx.strokeRect(x - 1, y - 1, pW + 2, pH + 2);
        sCtx.drawImage(canvas, x, y, pW, pH);
      }
    }

    const sheetBlob: Blob = await new Promise((res) =>
      sheetCanvas.toBlob((b) => res(b!), "image/jpeg", 0.95),
    );
    setSheetResultUrl(URL.createObjectURL(sheetBlob));
  }, [imgElement, selectedPreset, zoom, panX, panY, bgColor, compressUnder50kb]);

  useEffect(() => {
    if (imgElement) {
      void renderPassportPhoto();
    }
  }, [imgElement, selectedPreset, zoom, panX, panY, bgColor, compressUnder50kb, renderPassportPhoto]);

  function handleReset() {
    setFile(null);
    setImgElement(null);
    setSingleResultUrl(null);
    setSheetResultUrl(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Official Passport & Visa Specifications (300 DPI)
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Passport Photo Maker Online Free
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Create official passport size photos online for Indian passport, US visa (2x2 inch),
          Schengen visa (35x45mm), and government exams. Generate single photos or printable 6-photo sheets.
        </p>
      </div>

      {!file ? (
        <ImageDropzone onFile={handleFile} accept="image/png,image/jpeg,image/webp,image/jpg" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Controls & Preset Bar */}
          <div className="glass rounded-2xl p-6 space-y-6">
            {/* Presets */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                1. Select Document Standard
              </label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPreset(p)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedPreset.id === p.id
                        ? "border-2 border-primary bg-primary/5 shadow-sm"
                        : "border border-border hover:border-primary/40 bg-background/50"
                    }`}
                  >
                    <div className="font-semibold text-sm text-foreground">{p.name}</div>
                    <div className="text-xs font-medium text-primary mt-0.5">{p.country}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-tight">
                      {p.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustments: Zoom, Background, Size limit */}
            <div className="grid gap-6 sm:grid-cols-3 pt-2 border-t border-border/60">
              {/* Zoom */}
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
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: "original", label: "Original", bg: "bg-muted" },
                    { id: "white", label: "Pure White", bg: "bg-white border border-gray-300" },
                    { id: "offwhite", label: "Off-White", bg: "bg-neutral-200" },
                    { id: "blue", label: "Light Blue", bg: "bg-sky-200" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBgColor(b.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        bgColor === b.id
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Size Limit */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  File Size Target
                </label>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={compressUnder50kb}
                    onChange={(e) => setCompressUnder50kb(e.target.checked)}
                    className="rounded border-border accent-primary h-4 w-4"
                  />
                  <span className="text-xs font-medium text-foreground">
                    Strictly limit under 50 KB (Exam/Govt Limit)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Results: Single & 6-Photo Sheet */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Single Photo */}
            <div className="glass rounded-2xl p-6 border border-primary/30 flex flex-col items-center text-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Single Passport Photo
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {(singleFileSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/80 flex items-center justify-center min-h-[220px]">
                {singleResultUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={singleResultUrl}
                    alt="Passport Photo Preview"
                    className="max-h-52 object-contain rounded shadow-md"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground">Rendering...</div>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {selectedPreset.name} · {selectedPreset.wPx} × {selectedPreset.hPx} px (300 DPI)
              </p>
              {singleResultUrl && (
                <a
                  href={singleResultUrl}
                  download={`passport_photo_${selectedPreset.id}.jpg`}
                  className="mt-4 w-full"
                >
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Single Photo ({(singleFileSize / 1024).toFixed(1)} KB)
                  </Button>
                </a>
              )}
            </div>

            {/* 6-Photo Printable Sheet */}
            <div className="glass rounded-2xl p-6 border border-border/60 flex flex-col items-center text-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Printer className="h-4 w-4" />
                  6-Photo Print Sheet (4×6&quot;)
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Print Ready (300 DPI)
                </span>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/80 flex items-center justify-center min-h-[220px]">
                {sheetResultUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sheetResultUrl}
                    alt="6-Photo Print Sheet Preview"
                    className="max-h-52 object-contain rounded shadow-md"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground">Rendering print sheet...</div>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                6 Photos on 4×6 inch (10×15 cm) Sheet with Cutting Guides
              </p>
              {sheetResultUrl && (
                <a
                  href={sheetResultUrl}
                  download={`passport_sheet_6photos_4x6_${selectedPreset.id}.jpg`}
                  className="mt-4 w-full"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <Printer className="h-4 w-4" />
                    Download 4×6&quot; Print Sheet
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Reset Bar */}
          <div className="flex justify-start">
            <Button variant="ghost" onClick={handleReset} className="gap-2 text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              Upload Different Photo
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
