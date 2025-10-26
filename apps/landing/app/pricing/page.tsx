"use client";

import { motion } from "framer-motion";
import { Check } from "@mui/icons-material";
import { title } from "@vendora/ui";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Basic",
    price: "$9",
    description: "Perfect for solo sellers starting their online journey.",
    features: [
      "Up to 200 products",      
      "Basic analytics",      
    ],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Startup",
    price: "$29",
    description: "Ideal for growing stores that need advanced tools.",
    features: [
      "Unlimited products",
      "Marketing tools",      
      "Advanced analytics",      
    ],
    button: "Upgrade",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for large-scale commerce and teams.",
    features: [
      "Dedicated success manager",
      "API access",
      "Advanced integrations",
      "24/7 premium support",
    ],
    button: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          <span className={title({ color: "foreground", size: "lg"})}>Flexible Plans for Every{" "}</span>
          <span className={title({ color: "blue", size: "lg"})}>Business</span>
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Whether you&apos;re just starting or scaling fast, Vendora has a plan that
          fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex flex-col max-h-screen rounded-2xl border backdrop-blur-sm shadow-sm p-8 relative ${
              plan.popular
                ? "bg-white/50 dark:bg-zinc-700/20 border-blue-500"
                : "bg-white/30 dark:bg-zinc-700/80 border-gray-200 dark:border-gray-800"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {plan.description}
            </p>
            <div className="text-4xl font-extrabold mb-6">
              {plan.price}
              {plan.price !== "Custom" && (
                <span className="text-lg font-medium text-gray-500">/mo</span>
              )}
            </div>

            <ul className="space-y-3 mb-8 text-left">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="text-blue-600 w-5 h-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push("/register/seller")}
              className={`w-full py-2.5 mt-auto rounded-xl font-semibold transition ${
                plan.popular
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gradient-to-r from-white/90 to-black/10 dark:from-neutral-800/50 dark:to-zinc-950/40" + 
                    " hover:from-white/100 hover:to-black/20 dark:hover:from-neutral-700/50 dark:hover:to-zinc-950/70 text-black dark:text-white border border-gray-300 dark:border-gray-700"
              }`}
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
