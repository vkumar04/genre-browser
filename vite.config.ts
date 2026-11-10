import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { seo } from "./seo/vite-plugin-seo.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { chunkSizeWarningLimit: 700 },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
});
