import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    outDir: "../",
    rollupOptions: {
      output: {
        assetFileNames: "mm-io-app[extname]",
        entryFileNames: "mm-io-app.js"
      }
    }
  }
});
