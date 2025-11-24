import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Vendora",
  description: "Read the terms and conditions for using Vendora's e-commerce platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Terms & Conditions</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: January 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to <strong>Vendora</strong> (“we”, “our”, “us”). These Terms &
            Conditions (“Terms”) govern your access and use of our platform,
            including our website, dashboard, tools, and services (collectively,
            the “Service”).
          </p>
          <p>
            By accessing or using Vendora, you agree to be bound by these Terms.
            If you do not agree, you must stop using the Service immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Eligibility</h2>
          <p>
            You must be at least 18 years old and capable of entering a binding
            contract to use Vendora. By using the Service, you represent that the
            information you provide is accurate and complete.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Account Registration</h2>
          <p>
            To use certain features, you must create an account. You are
            responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maintaining the confidentiality of your login details</li>
            <li>All activity under your account</li>
            <li>Providing accurate and updated information</li>
          </ul>
          <p>
            We may suspend or terminate accounts that violate these Terms or pose
            a security risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Use of the Service</h2>
          <p>You agree not to use Vendora for any unlawful purpose, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Selling illegal or restricted items</li>
            <li>Engaging in fraudulent activities</li>
            <li>Violating local, national, or international laws</li>
            <li>Infringing intellectual property rights</li>
          </ul>
          <p>
            We reserve the right to review, approve, or remove content that
            violates our policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Product Listings</h2>
          <p>
            Sellers are responsible for the accuracy of their product listings,
            pricing, and inventory. Products uploaded to Vendora may be reviewed
            before being published.
          </p>
          <p>
            Vendora reserves the right to reject or remove listings that violate
            platform rules or legal standards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Fees & Payments</h2>
          <p>
            Some features of Vendora require a paid subscription. By upgrading
            your plan, you authorize us to charge your payment method on a
            recurring basis until cancelled.
          </p>
          <p>
            All fees are non-refundable unless required by law or explicitly
            stated in our <Link href="/help-center/refund" className="text-blue-600 underline">Refund Policy</Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
          <p>
            All content, branding, and software provided by Vendora remains our
            exclusive property. You may not copy, modify, distribute, or reverse
            engineer any part of the Service.
          </p>
          <p>
            Sellers retain ownership of the content they upload but grant Vendora
            a license to display and distribute it as needed for the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Termination</h2>
          <p>
            We may suspend or terminate your access to Vendora without prior
            notice if:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You violate these Terms</li>
            <li>Your behavior harms other users or the platform</li>
            <li>We are required by law</li>
          </ul>
          <p>
            You may delete your account at any time from your settings page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
          <p>
            Vendora is not responsible for losses resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Errors in product listings or seller behavior</li>
            <li>Service downtime, bugs, or technical issues</li>
            <li>Unauthorized access to your account</li>
          </ul>
          <p>
            The Service is provided “as is” without warranties of any kind.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Changes to These Terms</h2>
          <p>
            We may update these Terms at any time. Changes become effective once
            posted. Continued use of Vendora after updates means you accept the
            new Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Contact Us</h2>
          <p>
            If you have questions regarding these Terms, contact us at:  
            <br />
            <strong>support@vendora.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
