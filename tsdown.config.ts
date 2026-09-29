import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/oxlint.ts", "src/oxfmt.ts", "src/eslint.ts"],
  format: "esm",
  dts: true,
  exports: false,
  publint: true,
  attw: { profile: "esm-only" },
})
