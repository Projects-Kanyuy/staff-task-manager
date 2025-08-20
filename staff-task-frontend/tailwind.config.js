// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // The 'content' path tells Tailwind where to look for class names.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  // The 'theme' section is for custom, one-off styles.
  theme: {
    extend: {},
  },

  // --- THIS IS THE CRITICAL SECTION THAT WAS MISSING ---
  // We are adding the daisyui plugin to manage themes.
  plugins: [require("daisyui")],

  // DaisyUI configuration
  daisyui: {
    // A list of the themes you will use.
    // The CSS for both will be generated at build time.
    themes: [
      {
        futuristic: { // Your existing dark theme
          "primary": "#7c3aed",      // purple-600
          "secondary": "#3b82f6",     // blue-500
          "accent": "#1fb2a6",
          "neutral": "#2a323c",
          "base-100": "#0f172a",     // slate-900 (main background)
          "base-200": "#1e293b",     // slate-800 (card/table background)
          "base-300": "#334155",     // slate-700 (borders)
          "base-content": "#e2e8f0",  // slate-200 (default text)
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      {
        professional: { // Your new light theme
          "primary": "#3b82f6",      // blue-500
          "secondary": "#6366f1",     // indigo-500
          "accent": "#1fb2a6",
          "neutral": "#3d4451",
          "base-100": "#ffffff",     // white (main background)
          "base-200": "#f2f2f2",     // off-white (card/table background)
          "base-300": "#d1d5db",     // gray-300 (borders)
          "base-content": "#1f2937",  // gray-800 (default text)
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
    darkTheme: "futuristic", // Set our dark theme as the default for dark mode preference
  },
  // --------------------------------------------------------
}