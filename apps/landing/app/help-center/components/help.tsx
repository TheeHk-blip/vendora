"use client";

import { Search, Mail, Phone, QuestionMark } from "@mui/icons-material";
import Link from "next/link";

export default function HelpCenter() {
  const faqs = [
    {
      q: "How do I create an account?",
      a: "Visit the signup page, fill in your details, and verify your email. You can start using Vendora immediately."
    },
    {
      q: "How do I add products?",
      a: "Navigate to your dashboard → Products → Add Product. You can upload images, set prices, and manage inventory."
    },
    {
      q: "How do I upgrade my plan?",
      a: "Go to Settings → Billing. You can switch between Basic, Startup, and Enterprise anytime."
    },
    {
      q: "Why wasn't my product approved?",
      a: "We review products for safety and compliance. If rejected, you'll receive a message explaining the reason."
    },
  ];

  const quickLinks = [
    { label: "Account Issues", href: "/help-center/account" },
    { label: "Product Approval", href: "/help-center/products" },
    { label: "Billing & Payments", href: "/help-center/billing" },
    { label: "Using the Dashboard", href: "/help-center/dashboard" },
    { label: "Seller Guidelines", href: "/help-center/sellers" },
    { label: "Security & Privacy", href: "/help-center/security" },
  ];

  return (
    <div className="w-full min-h-screen bg-background px-4 md:px-8 py-12">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">Help Center</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Find answers to common questions or reach out to our support team.
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center w-full md:w-2/3 bg-gray-100 dark:bg-gray-800 rounded-xl p-3 shadow-sm">
              <Search className="opacity-50 mr-3" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Browse Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="p-4 rounded-xl bg-white/20 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
              >
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <details
                key={idx}
                className="group border-[0.5px] border-gray-600 dark:border-gray-300 rounded-xl p-4 bg-card cursor-pointer"
              >
                <summary className="flex items-center justify-between text-lg font-medium">
                  {item.q}
                  <QuestionMark className="opacity-70 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold">Still Need Help?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Our team is here to assist you.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
            <Link
              href="mailto:support@vendora.com"
              className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm"
            >
              <Mail /> Email Support
            </Link>

            <Link
              href="tel:+123456789"
              className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm"
            >
              <Phone /> Call Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
