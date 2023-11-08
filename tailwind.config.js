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
        '2xs': ['0.625rem', '1.25'],
        xs: ['0.75rem', '1.25'],
        sm: ['0.875rem', '1.25'],
        base: ['1rem', '1.25'],
        lg: ['1.125rem', '1.25'],
        xl: ['1.25rem', '1.25'],
        '2xl': ['1.5rem', '1.25'],
        '3xl': ['1.875rem', '1.25'],
        '4xl': ['2.25rem', '1.25'],
        '5xl': ['3rem', '1.25'],
        '6xl': ['3.75rem', '1.25'],
        '7xl': ['4.5rem', '1.25'],
        '8xl': ['6rem', '1.25'],
        '9xl': ['8rem', '1.25'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
