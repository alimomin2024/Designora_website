import AdSlot from "@/components/AdSlot";

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

        <div>
          <h3 className="text-lg font-semibold">How It Works</h3>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Use Cases</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            {useCases.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>

        <AdSlot slot="home-tools-below" />

        <div>
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
          <div className="mt-3 space-y-4">
            {faqs.map((f, i) => (
              <div key={i}>
                <h4 className="text-sm font-medium">{f.q}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
