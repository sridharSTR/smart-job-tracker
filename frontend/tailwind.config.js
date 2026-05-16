export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        mint: "#35c2a2",
        coral: "#ff6b6b",
        amber: "#f7b801"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
