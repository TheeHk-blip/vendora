"use client";
import { Diversity2, ShoppingBag, Store } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function HowVendoraWorks() {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6 },
    viewport: { once: true },
  });

  return (
    <section className="py-24 text-center">
      <motion.h2
        {...fadeUp(0.1)}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        How <span className="text-blue-600">Vendora</span> Works
      </motion.h2>

      <motion.p
        {...fadeUp(0.2)}
        className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-20"
      >
        A seamless commerce ecosystem where sellers manage their stores,
        Vendora powers the backend, and buyers shop effortlessly.
      </motion.p>

      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Seller */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col items-center text-center md:text-left"
        >
          <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-2xl mb-4">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Sellers</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xs">
            Create stores, upload products, manage orders, and grow your brand —
            all from your dashboard.
          </p>
        </motion.div>

        {/* Arrows / Flow Lines */}
        <motion.div
          {...fadeUp(0.4)}
          className="hidden md:block absolute left-1/3 right-1/3 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-600/60 to-blue-400/60"
        />

        {/* Vendora Hub */}
        <motion.div
          {...fadeUp(0.5)}
          className="flex flex-col items-center mx-10 my-10 md:my-0"
        >
          <div className="bg-blue-600 p-6 rounded-3xl shadow-xl text-white relative">
            <Diversity2 className="w-8 h-8 mb-2 mx-auto" />
            <h3 className="font-semibold text-xl">Vendora</h3>
            <p className="text-sm opacity-90">The all-in-one SaaS platform</p>

            {/* Animated Glow */}
            <div className="absolute inset-0 rounded-3xl bg-blue-400/30 blur-lg animate-pulse -z-10"></div>
          </div>
        </motion.div>

        {/* Buyer */}
        <motion.div
          {...fadeUp(0.6)}
          className="flex flex-col items-center text-center md:text-right"
        >
          <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-2xl mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Buyers</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xs">
            Discover verified stores, explore deals, and enjoy secure,
            streamlined shopping experiences.
          </p>
        </motion.div>
      </div>

      {/* Optional global reach */}
      <motion.div
        {...fadeUp(0.7)}
        className="mt-20 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400"
      >        
        <p>Connecting sellers and buyers across the world</p>
        <Diversity2 className="w-5 h-5 text-blue-500" />
      </motion.div>
    </section>
  );
}
