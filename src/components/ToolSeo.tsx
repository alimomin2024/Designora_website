import Link from "next/link";
import { BookOpen, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { blogPosts } from "@/lib/blog-posts";

interface FaqItem {
  readonly q: string;
  readonly a: string;
}

interface ToolSeoProps {
  toolName: string;
  headline: string;
  description: string;
  steps: readonly string[];
  useCases: readonly string[];
  faqs: readonly FaqItem[];
}

export default function ToolSeo({
  toolName,
  headline,
  description,
  steps,
  useCases,
  faqs,
}: ToolSeoProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: headline,
    description,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };

  // Find relevant blog guides matching this tool
  const matchingGuides = blogPosts.filter(
    (p) => p.toolLink.includes(toolName) || p.slug.includes(toolName)
  );
  const fallbackGuides = blogPosts.slice(0, 3);
  const relatedGuides = (matchingGuides.length >= 2 ? matchingGuides : [...matchingGuides, ...fallbackGuides]).slice(0, 3);

  return (
    <section className="mx-auto mt-12 max-w-4xl px-4 sm:px-6 lg:px-8">
      <AdSlot slot="home-hero-below" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="glass rounded-2xl p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold">{headline}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Benefits & Privacy Badges */}
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/30 p-3.5">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold">100% Private & Secure</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Files process in-browser without remote server uploads.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/30 p-3.5">
            <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold">Instant Processing</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Zero wait queues or bandwidth delays; download immediately.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/30 p-3.5">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold">High Resolution Output</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Preserves fine pixel details and aspect ratio fidelity.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">How It Works</h3>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Practical Use Cases</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            {useCases.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>

        {/* Related Guides Section */}
        {relatedGuides.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">Helpful Guides & Tutorials</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/blog/${guide.slug}`}
                  className="rounded-xl border border-border/50 bg-card/40 p-3.5 hover:border-primary/40 hover:bg-card/70 transition-all group flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {guide.title}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-primary/80 font-medium mt-2">
                    Read guide <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <AdSlot slot="home-tools-below" />

        <div>
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
          <div className="mt-3 space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-card/20 p-4">
                <h4 className="text-sm font-semibold">{f.q}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
