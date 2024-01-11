import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    minify: "terser",
    outDir: "../",
    terserOptions: {
      mangle: {
        reserved: ["io"]
      }
    },
    rollupOptions: {
      output: {
        assetFileNames: "mm-io-app[extname]",
        entryFileNames: "mm-io-app.js"
      }
    }
  }
});
