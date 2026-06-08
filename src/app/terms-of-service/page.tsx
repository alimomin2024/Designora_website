import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Designora",
  description: "Terms of service for Designora image tools and services.",
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" updatedAt="26 February 2026">
      <p>
        These Terms apply to your use of <strong>designoraa.in</strong> and services provided by{" "}
        <strong>MOHAMMAD ALI FAROOQUE MOMIN</strong>, trading as <strong>Designoraa</strong>.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using the website, creating an account, or purchasing credits, you agree to these Terms.
        If you do not agree, do not use the service.
      </p>

      <h2>2. Services</h2>
      <p>
        Designora provides online image tools, including AI-powered operations such as upscaling,
        background removal, and watermark removal.
      </p>

      <h2>3. Credits and Billing</h2>
      <ul>
        <li>Credits are required for paid tool usage.</li>
        <li>Tool credit costs are listed on the pricing page and may change over time.</li>
        <li>Non-AI tools may be offered as free and unlimited based on current pricing policy.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <ul>
        <li>Do not upload unlawful, abusive, or infringing content.</li>
        <li>Do not attempt to abuse APIs, bypass billing, or disrupt service availability.</li>
      </ul>

      <h2>5. Availability</h2>
      <p>
        We may update, suspend, or discontinue features at any time. We do not guarantee
        uninterrupted operation.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The platform code, branding, and service materials are owned by Designoraa and protected by
        applicable laws.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Designoraa is not liable for indirect or
        consequential damages arising from use of the service.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Courts in Bhiwandi, Maharashtra shall have
        jurisdiction.
      </p>

      <h2>9. Contact</h2>
      <p>
        Email: <a href="mailto:alimomin2424@gmail.com">alimomin2424@gmail.com</a>
        <br />
        Phone: <a href="tel:+917977398081">+91 7977398081</a>
      </p>
    </LegalLayout>
  );
}
