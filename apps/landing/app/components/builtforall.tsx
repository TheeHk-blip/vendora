"use client";
import { ShoppingBag, Store } from "@mui/icons-material";
import { title } from "@vendora/ui";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BuiltForEveryone() {
  return (
    <section className="py-24 px-4 rounded-[32px] bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        Built for <span className={title({ color: "green"})}>Sellers</span> &{" "}
        <span className={title({ color: "blue"})}>Buyers</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-12"
      >
        Vendora connects ambitious sellers with engaged buyers — all in one
        platform. Sell smarter, shop faster, and experience modern commerce the
        way it should be.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Seller Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white/20 dark:bg-zinc-600/60 shadow-sm p-8 text-left transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <Store className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-semibold">For Sellers</h3>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Launch your store in minutes with no code.</li>
            <li>• Manage products, orders & analytics from one dashboard.</li>
            <li>• Get instant payments and insights to grow faster.</li>
          </ul>
          <button
            className="mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 active:scale-99 text-white rounded-lg font-medium cursor-pointer transition-all duration-300"
          >
            <Link
            href="/register/seller"
            >
              Start Selling
            </Link>
          </button>          
        </motion.div>

        {/* Buyer Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white/20 dark:bg-zinc-600/60 shadow-sm p-8 text-left transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-semibold">For Buyers</h3>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Discover verified stores & exclusive deals.</li>
            <li>• Enjoy a unified, secure checkout experience.</li>
            <li>• Track your orders across multiple sellers easily.</li>
          </ul>
          <button
            className="mt-6 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 active:scale-99 text-white font-medium cursor-pointer transition-all duration-300"
          >
            <Link 
              href="/register/buyer"
            >          
              Start Shopping
            </Link>
          </button>          
        </motion.div>
      </div>
    </section>
  );
}
