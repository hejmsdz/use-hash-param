/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "use-hash-param",
      fileName: "use-hash-param",
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [dts()],
  test: {
    environment: "jsdom",
  },
});
