/// <reference types="vitest" />
import { copyFileSync } from "node:fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/use-hash-param.ts"),
      name: "use-hash-param",
      fileName: "use-hash-param",
      formats: ["es", "cjs", "umd"],
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
  plugins: [
    dts({
      afterBuild: () => {
        copyFileSync("dist/use-hash-param.d.ts", "dist/use-hash-param.d.cts");
      },
    }),
  ],
  test: {
    environment: "jsdom",
  },
});
