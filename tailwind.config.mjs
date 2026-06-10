/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

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
      scrollBehavior: { smooth: "smooth" },
    }
  },
  plugins: [
    require("./tailwind.theme"),
    plugin(function ({ addUtilities}) {
      addUtilities({
        ".gradient-text": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "color": "transparent",
          "-webkit-text-fill-color": "transparent",
        },
      });
    })
  ]
}
