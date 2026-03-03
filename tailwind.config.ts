import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
    },

    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    extend: {
      colors: {
        "primary-black": "#0B0B0B",
        "charcoal": "#111111",
        "gold": "#C6A75E",
        "gold-light": "#E8D4A8",
        "gold-dark": "#A8893D",
      },

      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        "plex-arabic": ['"IBM Plex Sans Arabic"', "sans-serif"],
      },

      fontSize: {
        display: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-1": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-2": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-3": ["1.5rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },

      spacing: {
        section: "5rem",
      },

      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },

      boxShadow: {
        gold: "0 0 20px rgba(198,167,94,0.25)",
      },

      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C6A75E 0%, #E8D4A8 50%, #A8893D 100%)",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),

    // RTL Support
    function ({ addBase }) {
      addBase({
        'html[dir="rtl"]': {
          direction: "rtl",
        },
        'html[dir="ltr"]': {
          direction: "ltr",
        },
      });
    },
  ],
};

export default config;