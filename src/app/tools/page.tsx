import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://designoraa.in";

const tools = [
  {
    href: "/tools/upscale",
    name: "AI Image Upscaler",
    description: "Upscale photos up to 4× with AI and download a high-resolution PNG.",
    category: "AI image tools",
  },
  {
    href: "/tools/background-removal",
    name: "Background Remover",
    description: "Create clean transparent PNG cutouts from product photos and portraits.",
    category: "AI image tools",
  },
  {
    href: "/tools/watermark-removal",
    name: "Watermark Remover",
    description: "Remove unwanted text and logos from images you own or have permission to edit.",
    category: "AI image tools",
  },
  {
    href: "/tools/enhance",
    name: "AI Image Enhancer",
    description: "Improve brightness, contrast, color, and sharpness in one click.",
    category: "AI image tools",
  },
  {
    href: "/tools/4k-photo-editor",
    name: "4K Photo Editor",
    description: "Enlarge and edit photos to 4K UHD with AI resolution upscaling.",
    category: "AI image tools",
  },
  {
    href: "/tools/unblur-image",
    name: "Unblur Image Online",
    description: "Fix blurry photos and restore edge sharpness in your browser.",
    category: "AI image tools",
  },
  {
    href: "/tools/resize",
    name: "Image Resizer",
    description: "Resize JPG, PNG, and WEBP images to exact pixel dimensions in your browser.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/crop-rotate",
    name: "Crop and Rotate Image",
    description: "Crop to exact pixel coordinates and rotate images in your browser.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/social-media-image-size",
    name: "Social Media Image Resizer",
    description: "Resize images for Instagram, Facebook, YouTube, TikTok, and more.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/batch-resize",
    name: "Batch Image Resizer",
    description: "Resize multiple images to the same dimensions at once.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/compress",
    name: "Image Compressor",
    description: "Reduce JPG, PNG, and WEBP file sizes with adjustable quality control.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/compress-to-50kb",
    name: "Compress to 50KB",
    description: "Strictly reduce image size to under 50KB for government forms and exams.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/compress-to-100kb",
    name: "Compress to 100KB",
    description: "Shrink image files to under 100KB for resumes, portals, and uploads.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/compress-to-20kb",
    name: "Compress to 20KB",
    description: "Reduce photo and signature sizes to under 20KB for official portals.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/passport-photo-maker",
    name: "Passport Photo Maker",
    description: "Create official passport photos (India 3.5×4.5cm, US 2×2 inch, Schengen) and 6-photo print sheets.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/circle-crop",
    name: "Circle Crop Image",
    description: "Crop photos into circular avatars with transparent PNG backgrounds.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/flip-image",
    name: "Flip Image",
    description: "Mirror images horizontally or flip photos upside down vertically.",
    category: "Resize and optimize",
  },
  {
    href: "/tools/convert",
    name: "PNG, JPG and WEBP Converter",
    description: "Convert between common image formats without uploading files to a server.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/heic-to-jpg",
    name: "HEIC to JPG Converter",
    description: "Convert HEIC and HEIF photos to JPG or PNG locally in your browser.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/jpg-to-pdf",
    name: "JPG to PDF Converter",
    description: "Convert and combine JPG, PNG, and WEBP photos into a multi-page PDF document.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/pdf-to-jpg",
    name: "PDF to JPG Converter",
    description: "Extract PDF pages into sharp, high-resolution JPEG images in your browser.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/png-to-jpg",
    name: "PNG to JPG Converter",
    description: "Convert PNG transparent or opaque graphics to lightweight JPG photos.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/jpg-to-png",
    name: "JPG to PNG Converter",
    description: "Convert JPEG photos into lossless PNG format with zero compression loss.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/webp-to-jpg",
    name: "WEBP to JPG Converter",
    description: "Convert modern web WEBP images to universally compatible JPG files.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/pdf",
    name: "PDF to Image Converter",
    description: "Convert PDF pages to PNG images or combine images into a PDF.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/metadata",
    name: "Image DPI and Metadata Editor",
    description: "View image details and set DPI metadata for print-ready files.",
    category: "Convert and prepare",
  },
  {
    href: "/tools/palette",
    name: "Color Palette Extractor",
    description: "Extract dominant colors and copy their hex codes for branding and design.",
    category: "Design tools",
  },
] as const;

export const metadata: Metadata = {
  title: "Free Online Image Tools",
  description:
    "Use free online tools to resize, crop, rotate, compress, convert, upscale, enhance, and remove backgrounds from images. Designora works in your browser with no software to install.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Online Image Tools | Designora",
    description:
      "Resize, crop, compress, convert, upscale, enhance, and edit images online with Designora.",
    url: "/tools",
    type: "website",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Designora Online Image Tools",
  url: `${siteUrl}/tools`,
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.name,
    url: `${siteUrl}${tool.href}`,
  })),
};

export default function ToolsPage() {
  const categories = [...new Set(tools.map((tool) => tool.category))];

  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Designora tools
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Free Online Image Tools
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Resize, compress, convert, upscale, enhance, and prepare images online. Browser-based
            tools are free to explore, and AI tools use affordable pay-as-you-go credits.
          </p>
        </header>

        <div className="mt-14 space-y-12">
          {categories.map((category) => (
            <section key={category} aria-labelledby={category.replaceAll(" ", "-")}>
              <h2
                id={category.replaceAll(" ", "-")}
                className="mb-5 text-2xl font-bold"
              >
                {category}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="glass gradient-border group rounded-2xl p-6 transition-transform hover:-translate-y-1"
                    >
                      <h3 className="text-lg font-semibold group-hover:text-primary">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {tool.description}
                      </p>
                      <span className="mt-5 inline-block text-sm font-medium text-primary">
                        Open tool →
                      </span>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-background/40 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-bold">Need help choosing a tool?</h2>
          <p className="mt-3 text-muted-foreground">
            Read our step-by-step image editing guides for practical advice on resizing for social
            media, compressing images for the web, preparing print files, and improving photo quality.
          </p>
          <Link
            href="/blog"
            className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Browse image editing guides →
          </Link>
        </section>
      </div>
    </div>
  );
}
