import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";

process.env.NODE_ENV = "production";

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: ["react", "react-dom", "react-router", "react-router-dom"],
  },
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: path.resolve(__dirname, "src"),
      },
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  build: {
    ssr: true,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "strict",
      input: { server: "src/entry-server.tsx" },
      output: {
        dir: ".stormkit/server",
        entryFileNames: "[name].mjs",
        format: "esm",
        exports: "named",
      },
    },
  },
  plugins: [react()],
});
