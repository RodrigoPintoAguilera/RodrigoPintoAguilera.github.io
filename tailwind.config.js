/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(0 0% 4%)',
        surface: 'hsl(0 0% 8%)',
        'text-primary': 'hsl(0 0% 96%)',
        muted: 'hsl(0 0% 53%)',
        stroke: 'hsl(0 0% 12%)',
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
