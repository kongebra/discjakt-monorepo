/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      textColor: {
        facebook: '#3b5998',
        twitter: '#1da1f2',
        linkedin: '#0077b5',
        whatsapp: '#25d366',
        telegram: '#0088cc',
        youtube: '#ff0000',
        instagram: '#e1306c',
        github: '#333333',
      },
    },
  },
  plugins: [require('daisyui')],
};
