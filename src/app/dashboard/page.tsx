"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Maximize,
  ArrowUpFromLine,
  Eraser,
  Droplets,
  Coins,
  Loader2,
  FileDown,
  RefreshCw,
  Layers,
  Palette,
  FileText,
  FileImage,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ToolCard";
import UsageBadge from "@/components/UsageBadge";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import Link from "next/link";

const tools = [
  {
    icon: Maximize,
    title: "Image Resize",
    key: "resize" as const,
    desc: "Resize to any dimensions with perfect quality.",
    href: "/tools/resize",
    gradient: "from-blue-500/20 to-cyan-500/20",
    creditCost: 1,
  },
  {
    icon: ArrowUpFromLine,
    title: "Image Upscaler",
    key: "upscale" as const,
    desc: "AI-powered upscaling up to 4x with Real-ESRGAN.",
    href: "/tools/upscale",
    gradient: "from-purple-500/20 to-pink-500/20",
    creditCost: 1,
  },
  {
    icon: Eraser,
    title: "Background Removal",
    key: "bgRemoval" as const,
    desc: "One-click AI background removal.",
    href: "/tools/background-removal",
    gradient: "from-emerald-500/20 to-teal-500/20",
    creditCost: 4,
  },
  {
    icon: Droplets,
    title: "Watermark Removal",
    key: "watermark" as const,
    desc: "Paint and erase watermarks with AI inpainting.",
    href: "/tools/watermark-removal",
    gradient: "from-orange-500/20 to-amber-500/20",
    creditCost: 4,
  },
  {
    icon: FileDown,
    title: "Image Compressor",
    key: "compress" as const,
    desc: "Reduce file size with quality control.",
    href: "/tools/compress",
    gradient: "from-lime-500/20 to-green-500/20",
    creditCost: 1,
  },
  {
    icon: RefreshCw,
    title: "Format Converter",
    key: "convert" as const,
    desc: "Convert between PNG, JPG, WEBP, AVIF.",
    href: "/tools/convert",
    gradient: "from-sky-500/20 to-blue-500/20",
    creditCost: 1,
  },
  {
    icon: Layers,
    title: "Batch Resize",
    key: "batchResize" as const,
    desc: "Resize multiple images at once.",
    href: "/tools/batch-resize",
    gradient: "from-indigo-500/20 to-violet-500/20",
    creditCost: 1,
  },
  {
    icon: Palette,
    title: "Color Palette",
    key: "palette" as const,
    desc: "Extract dominant colors from any image.",
    href: "/tools/palette",
    gradient: "from-pink-500/20 to-rose-500/20",
    creditCost: 1,
  },
  {
    icon: FileText,
    title: "Metadata / DPI Editor",
    key: "metadata" as const,
    desc: "View and edit EXIF data and DPI.",
    href: "/tools/metadata",
    gradient: "from-amber-500/20 to-yellow-500/20",
    creditCost: 1,
  },
  {
    icon: FileImage,
    title: "PDF ↔ Image",
    key: "pdf" as const,
    desc: "Convert PDF pages to images or images to PDF.",
    href: "/tools/pdf",
    gradient: "from-red-500/20 to-orange-500/20",
    creditCost: 1,
  },
  {
    icon: Sparkles,
    title: "AI Enhancer",
    key: "enhance" as const,
    desc: "Auto brightness, contrast, and sharpness.",
    href: "/tools/enhance",
    gradient: "from-fuchsia-500/20 to-purple-500/20",
    creditCost: 1,
  },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { loading: usageLoading, credits, dailyFreeRemaining } = useUsage();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  if (authLoading || usageLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user.displayName || user.email?.split("@")[0]}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {dailyFreeRemaining > 0
                ? `${dailyFreeRemaining} free uses left today`
                : "Daily free uses exhausted"}
              {credits > 0 ? ` · ${credits} credits` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UsageBadge credits={credits} dailyFreeRemaining={dailyFreeRemaining} />
            <Link href="/pricing">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow">
                <Coins className="h-4 w-4" /> Buy Credits
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <ToolCard
                icon={tool.icon}
                title={tool.title}
                description={tool.desc}
                href={tool.href}
                gradient={tool.gradient}
                creditCost={tool.creditCost}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
