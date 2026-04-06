import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiTarget = "http://localhost:3001";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/exams": { target: apiTarget, changeOrigin: true },
      "/todos": { target: apiTarget, changeOrigin: true },
      "/health": { target: apiTarget, changeOrigin: true }
    }
  }
});
