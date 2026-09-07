import Link from "next/link";

const guides = [
  {
    href: "/blog/4k-photo-editor-online-free",
    title: "4K photo editor: when AI upscaling is the right choice",
    description: "Compare an AI upscaler with a traditional image editor and choose the right workflow.",
  },
  {
    href: "/blog/how-to-upscale-image-to-4k-online",
    title: "How to plan an image for a 4K display",
    description: "Learn how input dimensions, aspect ratio, and a 4× upscale affect the final image size.",
  },
  {
    href: "/blog/ai-image-upscaler-free-online",
    title: "AI image upscaling: quality limits and best uses",
    description: "See which images respond well to AI upscaling and how to avoid common artifacts.",
  },
] as const;

export default function UpscalingGuides() {
  return (
    <section className="mx-auto mb-12 mt-8 max-w-4xl px-4 sm:px-6 lg:px-8" aria-labelledby="upscaling-guides">
      <div className="glass rounded-2xl p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Learn before you upscale</p>
        <h2 id="upscaling-guides" className="mt-2 text-xl font-bold">
          Guides for 4K photo and AI-upscaling workflows
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Upload a photo to convert it into a larger, 4K-ready result. The final pixels depend on your source dimensions and selected 2× or 4× factor; the tool preserves aspect ratio rather than forcing every file to 3840×2160.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-xl border border-border/70 p-4 transition-colors hover:border-primary/40"
            >
              <span className="text-sm font-semibold text-foreground">{guide.title}</span>
              <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                {guide.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
