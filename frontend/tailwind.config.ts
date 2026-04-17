import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Civic health-tech palette: teal-cyan primary, warm coral accent,
        // deep navy for text. Chosen to feel trustworthy + modern, not the
        // stock "medical blue + white" that every hospital app uses.
        ink: {
          DEFAULT: "#0B1F2A",
          soft: "#1A3342",
          muted: "#4A6778",
        },
        paper: {
          DEFAULT: "#FAFBF8",
          warm: "#F3F1EA",
          cream: "#EFEBE0",
        },
        compass: {
          50:  "#E8F6F4",
          100: "#C5E8E3",
          200: "#8DD1C8",
          300: "#5BBAAE",
          400: "#2FA296",
          500: "#108A7F",
          600: "#0B6E66",
          700: "#08544E",
          800: "#063C38",
          900: "#042824",
        },
        coral: {
          400: "#F28B6F",
          500: "#E8694A",
          600: "#C9513A",
        },
        amber: {
          400: "#E8B74A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        "soft": "0 1px 2px rgba(11,31,42,0.04), 0 8px 24px -12px rgba(11,31,42,0.12)",
        "panel": "0 1px 0 rgba(11,31,42,0.04), 0 20px 40px -24px rgba(11,31,42,0.18)",
      },
      backgroundImage: {
        "grid-faint": "linear-gradient(rgba(11,31,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,31,42,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
