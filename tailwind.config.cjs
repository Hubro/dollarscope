const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fake-ass-progress-bar": {
          // Don't show the bar right away. This prevents the bar from
          // flickering into view momentarily on quick page transitions.
          "0%": { width: "0%" },
          "5%": { width: "0%" },
          "8%": { width: "70%" },
          "15%": { width: "75%" },
          "25%": { width: "75%" },
          "40%": { width: "78%" },
          "50%": { width: "78%" },
          "55%": { width: "80%" },
          "70%": { width: "90%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "fake-ass-progress-bar": "fake-ass-progress-bar 5s ease-out",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("routing", "body.routing &");
    }),
  ],
};
