import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette")

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        container: "1280px",
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration) linear infinite',
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        },
        'marquee-reverse': {
          from: { transform: 'translateX(calc(-100% - var(--gap)))' },
          to: { transform: 'translateX(0)' }
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        ':root': {
          '--radius': '0.625rem',
          '--background': 'oklch(1 0 0)',
          '--foreground': 'oklch(0.145 0 0)',
          '--card': 'oklch(1 0 0)',
          '--card-foreground': 'oklch(0.145 0 0)',
          '--popover': 'oklch(1 0 0)',
          '--popover-foreground': 'oklch(0.145 0 0)',
          '--primary': 'oklch(0.205 0 0)',
          '--primary-foreground': 'oklch(0.985 0 0)',
          '--secondary': 'oklch(0.97 0 0)',
          '--secondary-foreground': 'oklch(0.205 0 0)',
          '--muted': 'oklch(0.97 0 0)',
          '--muted-foreground': 'oklch(0.556 0 0)',
          '--accent': 'oklch(0.97 0 0)',
          '--accent-foreground': 'oklch(0.205 0 0)',
          '--destructive': 'oklch(0.577 0.245 27.325)',
          '--border': 'oklch(0.922 0 0)',
          '--input': 'oklch(0.922 0 0)',
          '--ring': 'oklch(0.708 0 0)',
        },
        '.dark': {
          '--background': 'oklch(0.145 0 0)',
          '--foreground': 'oklch(0.985 0 0)',
          '--card': 'oklch(0.205 0 0)',
          '--card-foreground': 'oklch(0.985 0 0)',
          '--popover': 'oklch(0.205 0 0)',
          '--popover-foreground': 'oklch(0.985 0 0)',
          '--primary': 'oklch(0.922 0 0)',
          '--primary-foreground': 'oklch(0.205 0 0)',
          '--secondary': 'oklch(0.269 0 0)',
          '--secondary-foreground': 'oklch(0.985 0 0)',
          '--muted': 'oklch(0.269 0 0)',
          '--muted-foreground': 'oklch(0.708 0 0)',
          '--accent': 'oklch(0.269 0 0)',
          '--accent-foreground': 'oklch(0.985 0 0)',
          '--destructive': 'oklch(0.704 0.191 22.216)',
          '--border': 'oklch(1 0 0 / 10%)',
          '--input': 'oklch(1 0 0 / 15%)',
          '--ring': 'oklch(0.556 0 0)',
          '--tile': 'rgba(255, 255, 255, 0.1)',
        }
      })
    }),
    addVariablesForColors,
  ],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config