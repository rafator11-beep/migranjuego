import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // This removes the potential Node stream error when Rollup attempts
    // to include missing/broken polyfill modules that are not needed
    // now that simple-peer is fully removed.
    chunkSizeWarningLimit: 10000,
    assetsInlineLimit: 100000000, // Inline all assets
    rollupOptions: {
      external: ['stream', 'buffer', 'process', 'node:stream', 'node:buffer', 'node:process'],
      output: {
        manualChunks: undefined,
      },
    },
    minify: true,
    sourcemap: false,
  }
});
