const c = (v) => `rgb(var(--${v}) / <alpha-value>)`
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { bg: c('bg'), card: c('card'), ink: c('ink'), mute: c('mute'), line: c('line'), acc: c('acc'), accbg: c('accbg'), on: c('on') },
      fontFamily: { serif: ['Lora', 'Georgia', 'serif'], sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
