// For Tailwind v4 the PostCSS plugin is provided by @tailwindcss/postcss
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      base: process.cwd() + '/../..',
    },
    autoprefixer: {}
  }
};

export default config;
