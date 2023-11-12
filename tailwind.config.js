/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/screens/**/*.{js,jsx,ts,tsx}",  "./src/components/**/*.{js,jsx,ts,tsx}", "./src/navigation/index.js"],
  theme: {
    extend: {},
    colors: {
      'rojoIntenso': '#ff3e45',
      'celeste': '#cceaf5',
      'gris': '#a9a9a9',
      'grisClaro': '#efefef',
      'fondoOscurecido': 'rgba(0,0,0,0.5)',
      'negro': '#000000',
      'blanco': '#ffffff'
    },
  },
  
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
}
