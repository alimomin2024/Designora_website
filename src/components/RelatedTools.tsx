import Link from "next/link";

const ALL_TOOLS = [
  { slug: "heic-to-jpg", label: "HEIC to JPG Converter", short: "Convert HEIC and HEIF photos" },
  { slug: "crop-rotate", label: "Crop and Rotate", short: "Crop and rotate images" },
  { slug: "social-media-image-size", label: "Social Media Resizer", short: "Resize for social platforms" },
  { slug: "upscale", label: "AI Image Upscaler", short: "Upscale images to 2K & 4K" },
  { slug: "4k-photo-editor", label: "4K Photo Editor", short: "Enlarge & edit photos to 4K" },
  { slug: "background-removal", label: "Background Remover", short: "Remove image backgrounds" },
  { slug: "watermark-removal", label: "Watermark Remover", short: "Erase watermarks with AI" },
  { slug: "resize", label: "Image Resizer", short: "Resize to exact dimensions" },
  { slug: "compress", label: "Image Compressor", short: "Reduce file size" },
  { slug: "convert", label: "Format Converter", short: "PNG, JPG, WEBP conversion" },
  { slug: "batch-resize", label: "Batch Resizer", short: "Resize multiple images" },
  { slug: "palette", label: "Color Palette Extractor", short: "Extract colors from image" },
  { slug: "metadata", label: "DPI & Metadata Editor", short: "Change DPI for print" },
  { slug: "pdf", label: "PDF ↔ Image", short: "PDF to PNG, image to PDF" },
  { slug: "enhance", label: "AI Image Enhancer", short: "Improve photo quality" },
  { slug: "compress-to-50kb", label: "Compress to 50KB", short: "Under 50KB for exams & forms" },
  { slug: "compress-to-100kb", label: "Compress to 100KB", short: "Under 100KB for resumes & docs" },
  { slug: "compress-to-20kb", label: "Compress to 20KB", short: "Under 20KB signature reducer" },
  { slug: "passport-photo-maker", label: "Passport Photo Maker", short: "Official 2x2 & 35x45mm presets" },
  { slug: "unblur-image", label: "Unblur Image", short: "Fix blurry photos & sharpen" },
] as const;

interface RelatedToolsProps {
  current: string;
}

export default function RelatedTools({ current }: RelatedToolsProps) {
  const others = ALL_TOOLS.filter((t) => t.slug !== current).slice(0, 6);

  return (
    <section className="mx-auto mt-8 mb-12 max-w-4xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-bold mb-4">Related Free Image Tools</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.slug}`}
            className="glass rounded-xl p-4 transition-colors hover:border-primary/40 group"
          >
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">
              {t.label}
            </span>
            <span className="block text-xs text-muted-foreground mt-1">{t.short}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
