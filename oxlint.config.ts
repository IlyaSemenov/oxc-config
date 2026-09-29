import { defineConfig } from "oxlint"

import base from "./src/oxlint.ts"

export default defineConfig({
  extends: [base],
  ignorePatterns: ["tests/fixtures/**"],
})
