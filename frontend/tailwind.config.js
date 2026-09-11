/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        "surface-muted": "var(--color-surface-muted)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        primary: {
          DEFAULT: "var(--color-primary)",
          soft: "var(--color-primary-soft)",
          dark: "var(--color-primary-dark)",
        },
        secondary: "var(--color-secondary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        success: { DEFAULT: "var(--color-success)", soft: "var(--color-success-soft)" },
        warning: { DEFAULT: "var(--color-warning)", soft: "var(--color-warning-soft)" },
        danger: { DEFAULT: "var(--color-danger)", soft: "var(--color-danger-soft)", dark: "var(--color-danger-dark)" },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 24, 40, 0.04), 0 2px 8px rgba(16, 24, 40, 0.04)",
        elevated: "0 4px 16px rgba(16, 24, 40, 0.07), 0 1px 3px rgba(16, 24, 40, 0.05)",
        panel: "0 8px 30px rgba(16, 24, 40, 0.09), 0 2px 6px rgba(16, 24, 40, 0.05)",
        glow: "0 0 0 4px rgba(37, 99, 235, 0.12), 0 8px 24px rgba(37, 99, 235, 0.18)",
        "glow-danger": "0 0 0 4px rgba(220, 38, 38, 0.12), 0 8px 24px rgba(220, 38, 38, 0.22)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563EB 0%, #1D4ED8 55%, #1E3A8A 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #EFF5FF 0%, #E4EDFE 100%)",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "fade-slide-up": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: 0.7 },
          "70%": { transform: "scale(1.6)", opacity: 0 },
          "100%": { transform: "scale(1.6)", opacity: 0 },
        },
        "pulse-ring-slow": {
          "0%": { transform: "scale(0.85)", opacity: 0.5 },
          "100%": { transform: "scale(2.1)", opacity: 0 },
        },
        "wave": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.85)", opacity: 0 },
          "60%": { transform: "scale(1.03)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "fade-slide-up": "fade-slide-up 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
        "pulse-ring-slow": "pulse-ring-slow 2.4s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
        wave: "wave 1s ease-in-out infinite",
        "bounce-in": "bounce-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "gradient-pan": "gradient-pan 6s ease infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [],
};