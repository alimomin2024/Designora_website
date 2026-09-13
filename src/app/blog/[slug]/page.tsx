import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      images: ["/og-image.svg"],
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://designoraa.in";
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    url: articleUrl,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    image: `${siteUrl}/og-image.svg`,
    author: { "@type": "Organization", name: "Designora", url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "Designora",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.svg` },
    },
  };

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const n = blogPosts.length;
  const prevPost = blogPosts[(currentIndex - 1 + n) % n];
  const nextPost = blogPosts[(currentIndex + 1) % n];

  // Circular ring + same tool matches to guarantee multiple incoming links for all posts
  const sameToolPosts = blogPosts.filter((p) => p.slug !== slug && p.toolLink === post.toolLink);
  const offsetPosts = [
    blogPosts[(currentIndex + 2) % n],
    blogPosts[(currentIndex + 3) % n],
    blogPosts[(currentIndex + 4) % n],
    blogPosts[(currentIndex + 5) % n],
  ];

  const relatedMap = new Map<string, (typeof blogPosts)[0]>();
  [...sameToolPosts, ...offsetPosts].forEach((p) => {
    if (p.slug !== slug && !relatedMap.has(p.slug)) {
      relatedMap.set(p.slug, p);
    }
  });
  const related = Array.from(relatedMap.values()).slice(0, 4);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> All Guides & Tutorials
        </Link>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" /> Designora Guides
        </span>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>
      </header>

      {post.toolLink === "/tools/upscale" ? (
        <aside className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 p-5" aria-label="Try the AI image upscaler">
          <h2 className="text-base font-bold">Convert an image to a 4K-ready size</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Use the AI Image Upscaler to create a 2× or 4× PNG, then check the output dimensions for your display or project.
          </p>
          <Link href="/tools/upscale" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            Open the 4K Image Upscaler →
          </Link>
        </aside>
      ) : null}

      <div className="prose-custom space-y-8">
        {post.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl font-bold mb-3">{s.heading}</h2>
            {s.body.split("\n\n").map((para, j) => (
              <p
                key={j}
                className="text-sm text-muted-foreground leading-relaxed mb-3 whitespace-pre-line"
              >
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 glass rounded-2xl p-6 text-center">
        <p className="text-lg font-bold mb-2">Ready to try it?</p>
        <Link href={post.toolLink}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            {post.toolLabel} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <nav className="mt-12 grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-8" aria-label="Previous and Next guide navigation">
        <Link
          href={`/blog/${prevPost.slug}`}
          className="glass rounded-xl p-4 hover:border-primary/40 transition-colors group flex flex-col justify-between"
        >
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" /> Previous Guide
          </span>
          <span className="text-sm font-medium mt-2 line-clamp-1 group-hover:text-primary transition-colors">
            {prevPost.title}
          </span>
        </Link>
        <Link
          href={`/blog/${nextPost.slug}`}
          className="glass rounded-xl p-4 hover:border-primary/40 transition-colors group flex flex-col justify-between text-right"
        >
          <span className="flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            Next Guide <ChevronRight className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium mt-2 line-clamp-1 group-hover:text-primary transition-colors">
            {nextPost.title}
          </span>
        </Link>
      </nav>

      <section className="mt-10">
        <h2 className="text-lg font-bold mb-4">Related Guides & Tutorials</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="glass rounded-xl p-4 hover:border-primary/40 transition-colors group"
            >
              <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {r.title}
              </span>
              <span className="block text-xs text-muted-foreground mt-2">{r.readTime}</span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
