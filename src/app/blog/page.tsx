import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Image Editing Guides & Tutorials — Free Tips for Designers",
  description:
    "Free guides on image upscaling, background removal, compression, resizing, and more. Learn how to edit images online with step-by-step tutorials.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Designora Blog — Free Image Editing Guides",
    description: "Step-by-step guides for image upscaling, background removal, compression, and more.",
  },
};

export default function BlogListingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Guides & Tutorials
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Step-by-step guides to help you upscale, compress, convert, resize, and
          enhance images like a pro — all for free.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/40 group flex flex-col"
          >
            <h2 className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 flex-1">
              {post.metaDescription}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
            <span className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
              Read guide <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
