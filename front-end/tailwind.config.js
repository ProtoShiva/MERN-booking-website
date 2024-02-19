/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5385D"
      },
      fontFamily: {
        "airFont-b": ["airFont-b"],
        "airFont-r": ["airFont-r"],
        "airFont-m": ["ariFont-m"]
      }
    }
  },
  plugins: []
}
