/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './apps/**/*.{js,ts,jsx,tsx}',
    './packages/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        foreground: "var(--color-foreground)",
        background: "var(--color-background)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)"
      },
      scrollBehavior: { smooth: "smooth" }
    }
  },
  plugins: [require("./tailwind.theme")]
}
