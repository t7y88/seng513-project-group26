import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth"],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
