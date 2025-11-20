"use client";

import { ShoppingBag, Store } from "@mui/icons-material";
import { title } from "@vendora/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


export default function Onboarding() {
    const router = useRouter();

  const handleSelect = (role: "buyer" | "seller") => {
    router.push(`/register/${role}`);
  };

  return (
    <div className="min-h-screen w-full max-w-full flex justify-center bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-10 mx-5"
      >
        <h1 className={title({color: "foreground", size: "lg"})}> 
          Welcome to {" "}
          <span className={title({color: "blue", size: "lg"})}>Vendora</span>
        </h1>                 
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Choose your role to get started — whether you&apos;re here to buy or to sell.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Seller Option */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelect("seller")}
            className="p-6 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md bg-white/30 dark:bg-neutral-700/20 
            hover:shadow-lg cursor-pointer transition-all duration-500"
          >
            <Store className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-xl font-semibold mt-3 text-gray-900 dark:text-white">
              I&apos;m a Seller
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Upload products and manage your business with ease.
            </p>
          </motion.button>

          {/* Buyer Option */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelect("buyer")}
            className="p-6 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md bg-white/30 dark:bg-neutral-700/20 
            hover:shadow-lg cursor-pointer transition-all duration-500"
          >
            <ShoppingBag className="mx-auto h-12 w-12 text-blue-500" />
            <h2 className="text-xl font-semibold mt-3 text-gray-900 dark:text-white">
              I&apos;m a Buyer
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Browse, discover, and shop from trusted sellers.
            </p>
          </motion.button>          
        </div>
      </motion.div>
    </div>
  );
}