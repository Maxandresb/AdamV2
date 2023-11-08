/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/screens/**/*.{js,jsx,ts,tsx}",  "./src/components/**/*.{js,jsx,ts,tsx}", "./src/navigation/index.js"],
  theme: {
    extend: {},
    colors: {
      'redcoral': '#fa614f',
      'damasco': '#fad9a0',
      'salmon': '#f9a79c',
      'azul': '#96b9f3',
      'celeste': '#add5f9',
      'beige': '#f5f1c4',
      'azulnegro': '#233050',
      'fondoOscurecido': 'rgba(0,0,0,0.5)',
      'negro': '#000000',
      'blanco': '#ffffff'
    },
  },
  
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
}
