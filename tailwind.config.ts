import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
