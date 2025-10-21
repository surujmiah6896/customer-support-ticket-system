import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
      darkMode: "class", // optional (for dark mode toggle)
      plugins: {
        // You can include built-in plugins directly here
        typography: true,
        forms: true,
        aspectRatio: true,
      },
    }),
  ],
});
