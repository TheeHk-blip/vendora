import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Vendora collects, uses, and protects your information."
};

export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col px-6 md:px-12 py-10 justify-center bg-linear-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950"
      aria-label="Privacy Policy"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: September 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            At <strong>Vendora</strong>, we value your privacy and are committed
            to protecting your personal information. This Privacy Policy
            explains how we collect, use, and safeguard your data when you use
            our platform, including our website, dashboard, and services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account details such as name, email, and login credentials</li>
            <li>Business information including store details and uploaded products</li>
            <li>Usage data like analytics, impressions, and click-through rates</li>
            <li>Technical data such as IP address, browser type, and device info</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and improve our services</li>
            <li>To personalize your dashboard and user experience</li>
            <li>To analyze performance metrics and optimize workflows</li>
            <li>To communicate updates, offers, and support messages</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Sharing</h2>
          <p>
            We do not sell your personal information. Data may be shared with
            trusted third-party providers (such as payment processors or analytics
            services) strictly for operational purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data
            from unauthorized access, alteration, or disclosure. However, no
            method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be posted on this page with an updated revision date. Continued use
            of Vendora after updates means you accept the revised policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:  
            <br />
            <a href="mailto:mail@support.vendora.sbs" className="text-blue-600">
              mail@vendora.sbs
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}