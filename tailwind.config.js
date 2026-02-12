/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#0f172a",
          secondary: "#1e293b",
          elevated: "#334155",
        },
        status: {
          watchlist: "#60a5fa",
          watching: "#a78bfa",
          watched: "#34d399",
        },
      },
    },
  },
  plugins: [],
};
