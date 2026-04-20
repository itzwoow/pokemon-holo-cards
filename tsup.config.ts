import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  external: ["react", "react-dom"],
  injectStyle: true,   // bundles CSS into JS — no separate import needed
  clean: true,
  sourcemap: false,
  minify: false,
  treeshake: true,
  tsconfig: "tsconfig.json",
});
