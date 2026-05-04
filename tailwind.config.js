/** @type {import('tailwindcss').Config} */
// Hinweis zur safelist:
// Mehrere DeepDive-Module bauen Tailwind-Klassen dynamisch zusammen
// (z. B. `bg-${color}-50`, `border-${color}-300`, `text-${color}-800`).
// Tailwind kann solche Template-Strings beim Build nicht erkennen — die
// betroffenen Klassen müssen daher explizit als safelist eingetragen werden,
// sonst fehlen sie im finalen CSS und Hintergründe / Borders werden nicht angezeigt.
const SAFELIST_COLORS = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone'];
const SAFELIST_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const SAFELIST = SAFELIST_COLORS.flatMap((c) =>
  SAFELIST_SHADES.flatMap((s) => [
    `bg-${c}-${s}`,
    `text-${c}-${s}`,
    `border-${c}-${s}`,
    `ring-${c}-${s}`,
    `from-${c}-${s}`,
    `to-${c}-${s}`,
    `via-${c}-${s}`,
    `hover:bg-${c}-${s}`,
    `dark:bg-${c}-${s}`,
    `dark:text-${c}-${s}`,
    `dark:border-${c}-${s}`,
  ])
);

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: SAFELIST,
  theme: {
    extend: {
      colors: {
        // Design-Tokens: Brand = Teal (Wasser/Pool-Assoziation), Accent = Cyan
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Semantische Aliase (mappen auf Tailwind-Defaults)
        success: { 500: '#22c55e', 600: '#16a34a' },
        warning: { 500: '#f59e0b', 600: '#d97706' },
        danger:  { 500: '#ef4444', 600: '#dc2626' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'token-sm': '0.375rem',
        'token-md': '0.5rem',
        'token-lg': '0.75rem',
        'token-xl': '1rem',
      },
    },
  },
  plugins: [],
}
