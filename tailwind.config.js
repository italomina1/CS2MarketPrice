/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        night:"#0B0C10",
        bronze:"#C77C3E",
        ink:"#E8E8E8",
        slate:"#151820"
      },
      fontFamily:{
        display:['Rajdhani','system-ui','sans-serif'],
        body:['Inter','system-ui','sans-serif']
      }
    },
  },
  plugins: [],
}
