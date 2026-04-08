import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2872FA",
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
