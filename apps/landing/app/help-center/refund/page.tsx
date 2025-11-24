import { Metadata } from "next";

export const metadata: Metadata = ({
  title: "Refund Policy | Vendora",
  description: "Learn about Vendora's refund policy for subscriptions and services.",
})

export default function RefundPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
      <p className="mb-4">Last updated: January 1, 2025</p>

      <section className="space-y-4 text-lg leading-relaxed">
        <p>
          At Vendora, we strive to ensure all our users have a smooth and reliable experience.
          This Refund Policy outlines when refunds may be issued and how to request them.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Subscription Refunds</h2>
        <p>
          Vendora uses a subscription-based billing model. Refunds for subscriptions are handled
          under the following conditions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Refunds are available within <strong> 7 days</strong> of the initial purchase of a paid plan.</li>
          <li>
            Renewal payments are <strong> non-refundable</strong>, as users are notified prior to
            renewal and may cancel anytime before the renewal date.
          </li>
          <li>
            Refund requests made after the 7-day window will not be eligible unless required by law.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. Add-ons and Usage-Based Fees</h2>
        <p>
          Any additional purchases such as credits, usage-based fees, or add-on features are
          <strong> non-refundable</strong> once consumed or activated.
        </p>

        <h2 className="text-2xl font-semibold mt-8">3. Billing Errors</h2>
        <p>
          If you believe you were incorrectly charged, please contact our support team within
          <strong> 14 days</strong> of the billing date. Billing mistakes that are verified will be
          corrected or refunded.
        </p>

        <h2 className="text-2xl font-semibold mt-8">4. How to Request a Refund</h2>
        <p>You can submit a refund request by:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Opening a ticket at: <strong>support@vendora.com</strong></li>
          <li>Including your account email and transaction details</li>
          <li>Describing your reason for requesting a refund</li>
        </ul>

        <p>
          Our team will review your request and respond within 3-5 business days. Refund approvals
          are at the discretion of Vendora depending on eligibility and usage history.
        </p>

        <h2 className="text-2xl font-semibold mt-8">5. Chargebacks</h2>
        <p>
          Filing a chargeback with your bank or card provider without contacting us first may lead
          to temporary suspension of your account. We encourage users to reach out to us so we can
          resolve billing issues promptly.
        </p>

        <h2 className="text-2xl font-semibold mt-8">6. Changes to This Policy</h2>
        <p>
          Vendora reserves the right to update this Refund Policy at any time. Continued use of our
          services after changes are published constitutes acceptance of the updated terms.
        </p>

        <p className="mt-8">
          If you have questions about this Refund Policy, please contact us at
          <strong> support@vendora.com</strong>.
        </p>
      </section>
    </main>
  );
}
