"use client";

import { title } from "@vendora/ui";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">
      {/* Hero Section */}
      <section className="relative flex flex-col w-full max-w-7xl items-center justify-center text-center px-6 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={title({ color: "foreground", size: "lg"})}
        >
          Empowering Digital Commerce.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-8 text-gray-600 dark:text-gray-300 max-w-2xl"
        >
          Vendora is a multi-tenant SaaS platform designed to simplify e-commerce.
          Whether you&apos;re a seller looking to grow your business or a buyer exploring
          trusted stores, we bring everyone together under one streamlined system.
        </motion.p>                
      </section>

      {/* Mission Section */}
      <section className="px-6 py-8 max-w-6xl mx-auto text-center">
        <h2 className={title({ color: "foreground" })}>Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mt-5 mx-auto leading-relaxed">
          At Vendora, our mission is to empower small and medium-sized businesses
          by providing them with the tools they need to sell, manage, and scale
          online—without technical barriers.  
          We believe that e-commerce should be accessible, transparent, and
          powerful for everyone.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className={title({ color: "foreground" })}>How Vendora Works</h2>

          <div className="grid md:grid-cols-3 mt-10 gap-10">
            {/* Seller */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/40 dark:bg-zinc-800 p-8 rounded-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3">For Sellers</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Create your own storefront, upload products, track orders, and
                analyze performance—all from one clean dashboard.
              </p>
            </motion.div>

            {/* Buyer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white/40 dark:bg-zinc-800 p-8 rounded-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3">For Buyers</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Explore verified sellers, compare prices, and shop confidently
                through a secure and seamless experience.
              </p>
            </motion.div>

            {/* SaaS Layer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/40 dark:bg-zinc-800 p-8 rounded-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3">Powered by SaaS</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Vendora handles hosting, scaling, security, and payments so you
                can focus on what matters most—growing your business.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-24 max-w-6xl mx-auto text-center">
        <h2 className={title({ color: "foreground" })}>Our Core Values</h2>
        <div className="grid md:grid-cols-3 mt-5 gap-10">
          {[
            { title: "Simplicity", desc: "We remove complexity so you can focus on selling." },
            { title: "Trust", desc: "We build secure systems that protect your data and transactions." },
            { title: "Innovation", desc: "We constantly improve to help you stay ahead in commerce." },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/50 dark:bg-zinc-800 p-8 rounded-xl shadow-sm transition"
            >
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-zinc-400 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col py-5 items-center text-center">
        <h2 className={title({ color: "foreground", className: "mb-8" })}>
          Ready to join Vendora?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Create your account and start your e-commerce journey today.
        </p>
        <Link
          href="/onboarding"
          className="bg-blue-600 hover:bg-blue-700 text-white text-base max-w-fit px-6 py-3 mb-5 rounded-2xl transition-colors duration-300"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}