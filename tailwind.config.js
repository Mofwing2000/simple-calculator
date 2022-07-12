/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      margin: {
        0.5: "0.5px",
      },
      width: {
        doubleWidth: "161px",
        324: "324px",
        348: "348px",
      },
      height: {
        doubleHeight: "161px",
      },
      backgroundColor: {
        acBg: "#AC3939",
        numBg: "#4D4D4D",
        operatorBg: "#666666",
        equalBg: "#004466",
      },
      translate: {
        translate81: "81px",
      },
    },
  },
  plugins: [],
};
