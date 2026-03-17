/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Keep primary (amber/yellow) for CTAs
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Sage green - nature/wellness
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c5d9c5',
          300: '#9ebf9e',
          400: '#84a98c',
          500: '#6b8f71',
          600: '#52796f',
          700: '#426654',
          800: '#354d42',
          900: '#2d3d35',
        },
        // Warm cream backgrounds
        warm: {
          50: '#faf8f5',
          100: '#f5f1eb',
          200: '#ebe6dd',
          300: '#dfd8cc',
          400: '#c9bfab',
        },
        // Ink/dark for text
        ink: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d4d4d4',
          300: '#b8b8b8',
          400: '#9a9a9a',
          500: '#6b6b6b',
          600: '#4a4a4a',
          700: '#333333',
          800: '#1f1f1f',
          900: '#0f0f0f',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'fadeIn': 'fadeIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
