const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addBase}) {
  addBase({
    ".light": {
      "--color-foreground": "#000000",
      "--color-background": "#DADDD0",
      "--color-admin-foreground": "#000000",
      "--color-admin-background": "#F1EAFF",      
    },
    ".dark": {
      "--color-foreground": "#FFFFFF",
      "--color-background": "#171717",
      "--color-admin-foreground": "#FFFFFF",
      "--color-admin-background": "#1E1E2D",
    }
  })
})