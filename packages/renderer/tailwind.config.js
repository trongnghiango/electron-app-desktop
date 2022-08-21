/** @type {import('tailwindcss').Config} */

const {join} = require('path');
const pathContent = join(__dirname, 'src/**/*.{ts,tsx}' );
module.exports = {
  content: [
    pathContent,
    // './src/**/*.{tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
