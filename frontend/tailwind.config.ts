import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        forge: "#2563eb",
        mint: "#10b981",
        ember: "#f97316"
      }
    }
  },
  plugins: []
} satisfies Config;
