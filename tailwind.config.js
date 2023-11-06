/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          blue: '#13165C',
          'light-blue': '#306FD8',
          green: '#5EAC8D',
          yellow: '#F8D35D',
          background: '#F6F6F6',
        },
        text: {
          dark: '#121D3E',
          regular: '#222325',
        },
      },
      fontSize: {
        '2xs': '0.625rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
