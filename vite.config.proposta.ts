import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client-proposta", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client-proposta"),
  build: {
    outDir: path.resolve(import.meta.dirname, "public_html/proposta"),
    emptyOutDir: false,
  },
});
