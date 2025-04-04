export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,css}", // Include all relevant files
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra large screens
        "2xl": "1536px", // 2x extra large screens
      },
    },
  },
  plugins: [],
};
