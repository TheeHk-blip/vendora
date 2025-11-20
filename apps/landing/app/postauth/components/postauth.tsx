"use client";

import { title } from "@vendora/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Limelight } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const limelight = Limelight({ 
  subsets: ["latin"],
  variable: "--font-limelight", 
  weight: ["400"] 
});

const steps = [
  "Authenticating with Google...",
  "Setting up your account...",
  "Redirecting you home...",
];

export default function PostAuth() {
    const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Handle progress simulation for better UX
    const progress = async () => {
      try {
        await fetch("/api/auth/persist-role", { method: "POST" });
        // Move through steps for visual feedback
        timer = setInterval(() => {
          setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1500);
      } catch (error) {
        console.error("Error persisting role:", error);
      } finally {
        // Redirect slightly after final step for smoothness
        setTimeout(() => router.replace("/"), steps.length * 1500 + 500);
      }
    };

    progress();
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.1),_transparent_70%)]"></div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={title({ color: "blue", size: "lg", className: limelight.className })}
      >
        Vendora, 
      </motion.h1>
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={title({ color: "foreground", size: "md", className: "mb-5"})}>
        Home of modern Commerce
      </motion.span>

      {/* Loader Spinner */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-12 h-12 border-4 border-zinc-700 border-t-indigo-500 rounded-full my-6"
      />

      {/* Step Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-zinc-300 text-sm text-center"
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>

      {/* Subtext */}
      <p className="text-zinc-500 text-xs mt-3">
        Please wait a moment while we complete setup.
      </p>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-indigo-500"
        initial={{ width: "0%" }}
        animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
}