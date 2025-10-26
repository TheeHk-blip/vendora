"use client";
import { Analytics, Api, Dashboard, People, Security, ShoppingCart } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6 },
    viewport: { once: true },
  });

  const features = [
    {
      icon: <Dashboard className="w-8 h-8 text-blue-600" />,
      title: "Unified Dashboard",
      description:
        "Manage products, track analytics, and control multiple stores from one powerful dashboard.",
    },
    {
      icon: <People className="w-8 h-8 text-blue-600" />,
      title: "Multi-Tenant Platform",
      description:
        "Vendora's architecture allows sellers and buyers to coexist securely under one scalable ecosystem.",
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
      title: "Seamless Checkout",
      description:
        "Unified checkout experience for customers shopping across multiple vendors — smooth, fast, and secure.",
    },
    {
      icon: <Analytics className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Insights",
      description:
        "Access up-to-date sales metrics, customer behavior, and performance analytics instantly.",
    },
    {
      icon: <Security className="w-8 h-8 text-blue-600" />,
      title: "Secure & Compliant",
      description:
        "Vendora ensures enterprise-grade security, data encryption, and privacy for every tenant.",
    },
    {
      icon: <Api className="w-8 h-8 text-blue-600" />,
      title: "API-Ready & Extensible",
      description:
        "Integrate your existing tools, connect custom APIs, and expand Vendora’s capabilities effortlessly.",
    },
  ];

  return (
    <section id="features" className="py-24 rounded-3xl bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Powerful Features Built for <span className="text-blue-600">Growth</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-16"
        >
          Everything you need to run a thriving e-commerce ecosystem — for both
          sellers and buyers.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.2 + i * 0.1)}
              className="p-6 bg-white/30 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-zinc-700"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
