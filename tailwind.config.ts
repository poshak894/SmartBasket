export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "2.5rem"
      }
    },
    extend: {
      colors: {
        brand: {
          50: "#F6E8DA",
          100: "#E9CFB5",
          500: "#C08552",
          600: "#8C5A3C",
          900: "#4B2E2B",
          primary: "#C08552",
          secondary: "#8C5A3C",
          dark: "#4B2E2B",
          light: "#FFF8F0"
        },
        surface: {
          0: "#FFFFFF",
          50: "#FFF8F0",
          100: "#F7EEE3",
          200: "#EADBCB",
          800: "#6B4940",
          900: "#4B2E2B"
        },
        success: {
          50: "#E8FDF7",
          500: "#00C896"
        },
        warning: {
          50: "#FFFBEB",
          500: "#F59E0B"
        },
        danger: {
          50: "#FEF2F2",
          500: "#EF4444"
        },
        border: "#EADBCB",
        input: "#EADBCB",
        ring: "#C08552",
        background: "#FFF8F0",
        foreground: "#4B2E2B",
        primary: {
          DEFAULT: "#C08552",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#F7EEE3",
          foreground: "#4B2E2B"
        },
        muted: {
          DEFAULT: "#F7EEE3",
          foreground: "#7A5C4A"
        }
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        elevated: "0 8px 32px rgba(192,133,82,0.18)",
        glow: "0 0 40px rgba(192,133,82,0.35)"
      },
      fontFamily: {
        sans: ["var(--font-satoshi)"],
        mono: ["var(--font-jetbrains-mono)"]
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" }
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.5s linear infinite",
        "pulse-ring": "pulseRing 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.8s ease forwards",
        slowSpin: "spin 20s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
