import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 maps '@' to 'src' folder
    },
  },
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true, // 👈 ensures client-side routing works
  },
  publicDir: "public",
  build: {
    outDir: "dist",
  },
  define: {
    "process.env": {},
  },
});
