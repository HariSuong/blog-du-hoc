import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-heading)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
