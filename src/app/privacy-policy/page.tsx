import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Designora",
  description: "Privacy policy for Designora image tools and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="26 February 2026">
      <p>
        This Privacy Policy applies to <strong>designoraa.in</strong>, operated by{" "}
        <strong>MOHAMMAD ALI FAROOQUE MOMIN</strong>, trading as <strong>Designoraa</strong>.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Account Information:</strong> Name and email address for sign-up and login.
        </li>
        <li>
          <strong>Usage Data:</strong> IP address, browser type, device information, and pages visited.
        </li>
        <li>
          <strong>Transaction Data:</strong> Payment status, order ID, and credits purchased.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To create and manage your account</li>
        <li>To provide image processing tools and deduct credits</li>
        <li>To process payments and verify transactions</li>
        <li>To provide support and service updates</li>
        <li>To improve performance, security, and product quality</li>
      </ul>

      <h2>3. Payment Security</h2>
      <p>
        Payments are processed through third-party providers (Cashfree). We do not store raw card
        or UPI PIN details on our servers.
      </p>

      <h2>4. Data Sharing</h2>
      <p>We do not sell personal data. We may share data with:</p>
      <ul>
        <li>Payment processors for transaction handling</li>
        <li>Cloud and analytics providers for hosting and monitoring</li>
        <li>Legal authorities if required by law</li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        We keep personal data only for as long as necessary for account operations, legal
        compliance, and fraud prevention.
      </p>

      <h2>6. Cookies and Tracking</h2>
      <p>
        We may use cookies and similar technologies for session handling, analytics, and ad
        delivery. You can manage cookies in your browser settings.
      </p>

      <h2>7. Your Rights</h2>
      <p>You can request access, correction, or deletion of your personal data by contacting us.</p>

      <h2>8. Contact</h2>
      <p>
        Email: <a href="mailto:alimomin2424@gmail.com">alimomin2424@gmail.com</a>
        <br />
        Phone: <a href="tel:+917977398081">+91 7977398081</a>
      </p>
    </LegalLayout>
  );
}
