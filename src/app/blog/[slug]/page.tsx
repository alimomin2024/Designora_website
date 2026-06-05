import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, Clock } from "lucide-react";
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
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Designora" },
    publisher: { "@type": "Organization", name: "Designora", url: "https://www.designoraa.in" },
  };

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; All guides
        </Link>
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

      <section className="mt-12">
        <h2 className="text-lg font-bold mb-4">More Guides</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="glass rounded-xl p-4 hover:border-primary/40 transition-colors group"
            >
              <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {r.title}
              </span>
              <span className="block text-xs text-muted-foreground mt-1">{r.readTime}</span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
