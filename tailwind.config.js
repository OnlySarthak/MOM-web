/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-highest": "#e3e2df",
        "secondary-fixed": "#dce1ff",
        "secondary": "#4d5b94",
        "on-secondary-fixed-variant": "#35437b",
        "surface-dim": "#dbdad7",
        "on-background": "#1b1c1a",
        "tertiary-container": "#a73400",
        "primary-fixed-dim": "#b7c4ff",
        "surface-container-lowest": "#ffffff",
        "surface-bright": "#faf9f6",
        "on-tertiary-container": "#ffc9b7",
        "secondary-container": "#b0befe",
        "outline-variant": "#c4c5d7",
        "tertiary-fixed": "#ffdbcf",
        "surface-container-low": "#f4f3f0",
        "primary-container": "#1d4ed8",
        "inverse-primary": "#b7c4ff",
        "secondary-fixed-dim": "#b7c4ff",
        "on-tertiary-fixed-variant": "#832700",
        "on-tertiary": "#ffffff",
        "primary": "#0037b0",
        "surface-variant": "#e3e2df",
        "inverse-on-surface": "#f2f1ee",
        "outline": "#747686",
        "on-surface-variant": "#434655",
        "on-primary": "#ffffff",
        "tertiary-fixed-dim": "#ffb59c",
        "background": "#faf9f6",
        "surface": "#faf9f6",
        "on-secondary": "#ffffff",
        "on-primary-container": "#cad3ff",
        "on-primary-fixed": "#001551",
        "error-container": "#ffdad6",
        "surface-container-high": "#e9e8e5",
        "on-secondary-container": "#3d4c83",
        "on-secondary-fixed": "#03164d",
        "on-surface": "#1b1c1a",
        "surface-container": "#efeeeb",
        "on-error": "#ffffff",
        "primary-fixed": "#dce1ff",
        "surface-tint": "#2151da",
        "on-primary-fixed-variant": "#0039b5",
        "error": "#ba1a1a",
        "inverse-surface": "#2f312f",
        "tertiary": "#7f2500",
        "on-tertiary-fixed": "#390c00",
        "on-error-container": "#93000a"
      },
      fontFamily: {
        "headline": ["Newsreader", "serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
