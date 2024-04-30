/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      colors: {
        title: '#111827',
        'sub-title': '#718096',
        success: '#0CAF60',
        border: '#EDF2F7'
      }
    }
  },
  plugins: []
}
