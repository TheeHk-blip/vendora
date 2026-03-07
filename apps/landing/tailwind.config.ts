/* eslint-disable @typescript-eslint/no-require-imports */
import { Config } from "tailwindcss";

const config: Config = {
  // Inherit root config
  presets: [require("../../tailwind.config.mjs")],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // include the package source so Tailwind scans classes used in @vendora/ui
    "../packages/ui/**/*.{js,ts,jsx,tsx}",
    // sometimes useful to include package root (if you compile to dist)
    "../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        limelight: [`var(--font-limelight)`],     
      }
    },
  },
  plugins: [],
};

export default config;