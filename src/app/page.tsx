"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Maximize,
  ArrowUpFromLine,
  Eraser,
  Droplets,
  ArrowRight,
  Check,
  Zap,
  FileDown,
  RefreshCw,
  Layers,
  Palette,
  FileText,
  FileImage,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdSlot from "@/components/AdSlot";

const tools = [
  {
    icon: Maximize,
    title: "Image Resize",
    desc: "Resize images to any dimension instantly with pixel-perfect quality.",
    href: "/tools/resize",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: ArrowUpFromLine,
    title: "AI Image Upscaler",
    desc: "Upscale low-res images up to 4x using Real-ESRGAN AI super-resolution.",
    href: "/tools/upscale",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Eraser,
    title: "Background Removal",
    desc: "Remove backgrounds instantly with AI — perfect cutouts, zero effort.",
    href: "/tools/background-removal",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Droplets,
    title: "Watermark Removal",
    desc: "Paint over watermarks and let AI inpainting fill in the details.",
    href: "/tools/watermark-removal",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    icon: FileDown,
    title: "Image Compressor",
    desc: "Reduce file size with adjustable quality — like TinyPNG, in your browser.",
    href: "/tools/compress",
    gradient: "from-lime-500/20 to-green-500/20",
  },
  {
    icon: RefreshCw,
    title: "Format Converter",
    desc: "Convert between PNG, JPG, WEBP instantly. No uploads needed.",
    href: "/tools/convert",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: Layers,
    title: "Batch Resize",
    desc: "Upload multiple images and resize them all to target dimensions at once.",
    href: "/tools/batch-resize",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  {
    icon: Palette,
    title: "Color Palette Extractor",
    desc: "Extract dominant colors from any image with one click.",
    href: "/tools/palette",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: FileText,
    title: "Metadata / DPI Editor",
    desc: "View image info and set DPI for print-ready output.",
    href: "/tools/metadata",
    gradient: "from-amber-500/20 to-yellow-500/20",
  },
  {
    icon: FileImage,
    title: "PDF ↔ Image",
    desc: "Convert PDF pages to images or combine images into a PDF.",
    href: "/tools/pdf",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    icon: Sparkles,
    title: "AI Image Enhancer",
    desc: "Auto brightness, contrast, and sharpness in one click.",
    href: "/tools/enhance",
    gradient: "from-fuchsia-500/20 to-purple-500/20",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

const faqs = [
  { q: "Is this an image upscaler AI free tool?", a: "Yes — Designora offers a free AI image upscaler that can enhance photos to 2K and 4K resolution using Real-ESRGAN deep learning. You get 3 free standard tool uses daily, and AI upscaling credits start at just 1 credit." },
  { q: "How do I remove image background online?", a: "Upload any image to Designora's AI background remover. It automatically detects the subject and creates a clean transparent PNG cutout. No manual selection needed." },
  { q: "Can I remove watermarks from images?", a: "Yes — paint over the watermark area with the brush tool and the AI inpainting engine fills it in with natural content matching the surrounding image." },
  { q: "What free online image tools are available?", a: "Designora includes 11 tools: image resize, AI upscaler, background removal, watermark removal, image compressor, format converter, batch resize, color palette extractor, DPI editor, PDF converter, and AI image enhancer." },
  { q: "Is Designora safe to use? Are my images private?", a: "Most tools run entirely in your browser — images never leave your device. AI tools send data to secure servers for processing and immediately discard it after." },
  { q: "How much does it cost?", a: "Standard tools like resize, compress, and convert offer 3 free uses daily. AI tools use credits at 1-4 credits each. Buy 100 credits for just $1 — no subscription required." },
  { q: "What image formats are supported?", a: "All tools support PNG, JPG, and WEBP. The PDF tool handles PDF files. Output formats vary by tool." },
  { q: "Can I use these tools on mobile?", a: "Yes — Designora is fully responsive and works on phones, tablets, and desktops in any modern browser." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Designora",
  url: "https://www.designoraa.in",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online AI image tools — upscale, remove backgrounds, compress, resize, convert, and enhance images directly in your browser.",
};

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute top-60 -right-40 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" />
            AI-powered image tools — fast, private, and affordable
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Professional image tools,{" "}
            <span className="gradient-text">powered by AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Resize, upscale, remove backgrounds, compress, convert, extract colors,
            and more — all in one place. 3 free uses daily for standard tools, then just $1 for 100 credits.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base glow"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8 text-base">
                Try the Tools
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <AdSlot slot="home-hero-below" />

      {/* Tools Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4 text-center text-3xl font-bold sm:text-4xl"
        >
          Everything you need,{" "}
          <span className="gradient-text">in one place</span>
        </motion.h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
          {tools.length} powerful tools designed for speed and quality. No installs, no
          sign-ups required to explore.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link href={tool.href} className="group block h-full">
                <div className="glass gradient-border h-full rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/5">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient}`}
                  >
                    <tool.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <AdSlot slot="home-tools-below" />

      {/* Why Designora */}
      <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">
          Why Choose <span className="gradient-text">Designora</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Designora is a free suite of online image editing tools built for speed and privacy.
          From AI-powered image upscaling and background removal to simple resizing and compression,
          every tool runs in your browser with no software to install.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="glass rounded-2xl p-5 text-center">
            <h3 className="text-lg font-semibold">Browser-Based</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Most tools process images locally on your device. No uploads, no waiting for servers.
            </p>
          </div>
          <div className="glass rounded-2xl p-5 text-center">
            <h3 className="text-lg font-semibold">AI-Powered</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-ESRGAN upscaling, BiRefNet background removal, and AI inpainting produce professional results.
            </p>
          </div>
          <div className="glass rounded-2xl p-5 text-center">
            <h3 className="text-lg font-semibold">Affordable</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              3 free daily uses for standard tools. AI tools start at 1 credit each — 100 credits for $1.
            </p>
          </div>
        </div>
      </section>

      {/* SEO FAQ */}
      <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">
          Frequently Asked Questions About <span className="gradient-text">AI Image Tools</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {faqs.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <h3 className="text-lg font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass gradient-border rounded-3xl p-8 sm:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Start free, scale with <span className="gradient-text">credits</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Every account gets 3 free uses daily for standard tools. AI tools use credits.
              Need more? Buy 100 credits for just $1 and use any tool, anytime.
            </p>
            <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div className="space-y-2 text-left">
                {[
                  "3 free uses every day",
                  `All ${tools.length} tools included`,
                  "No subscription required",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-border sm:h-20 sm:w-px" />
              <div className="text-center">
                <div className="text-5xl font-extrabold gradient-text">$1</div>
                <div className="text-sm text-muted-foreground mt-1">
                  for 100 credits
                </div>
                <Link href="/pricing" className="mt-4 block">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow">
                    Buy Credits
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
