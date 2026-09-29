// Oxlint handles scripts; this config checks Vue templates and template variable usage.

import { vue } from "@antfu/eslint-config"
import type { Linter } from "eslint"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

/** Options for the Vue SFC configuration. */
export interface EslintOptions {
  /**
   * Enable Pug templates with the optional eslint-plugin-vue-pug peer.
   * This disables incompatible HTML rules for all Vue files in the config.
   * @default false
   */
  vuePug?: boolean
}

/** Create Vue SFC rules complementing oxlint, with optional Pug support. */
export default async function createConfig({ vuePug = false }: EslintOptions = {}): Promise<
  Linter.Config[]
> {
  const configs = defineConfig(
    // Stylelint handles <style> blocks in the consuming project.
    await vue({
      typescript: true,
      sfcBlocks: false,
      stylistic: {
        braceStyle: "1tbs",
      },
    }),
    {
      name: "ilyasemenov/vue/oxlint",
      plugins: {
        "@typescript-eslint": tseslint.plugin,
      },
      rules: {
        // Oxlint cannot account for variables referenced by templates.
        "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
      },
    },
    {
      name: "ilyasemenov/vue/rules",
      rules: {
        // <component-name>
        "vue/component-name-in-template-casing": [
          "error",
          "kebab-case",
          { registeredComponentsOnly: false },
        ],
        // disable empty <script> and <style> blocks
        "vue/no-empty-component-block": "error",
        // allow string + string
        "vue/prefer-template": "off",
        // allow v-for without :key
        "vue/require-v-for-key": "off",
      },
    },
  )

  if (vuePug) {
    const { default: pluginVuePug } = await import("eslint-plugin-vue-pug")
    configs.push(
      ...defineConfig(
        // The plugin declaration mixes legacy and flat configs; this key is a flat array.
        pluginVuePug.configs["flat/recommended"] as Linter.Config[],
        {
          name: "ilyasemenov/vue-pug/compat",
          rules: {
            // HTML entity escapes break JavaScript expressions in Pug attributes.
            "vue/html-quotes": ["error", "double", { avoidEscape: true }],
          },
        },
        {
          name: "ilyasemenov/vue-pug/rules",
          rules: {
            // component-name
            "vue-pug/component-name-in-template-casing": [
              "error",
              "kebab-case",
              { registeredComponentsOnly: false },
            ],
          },
        },
      ),
    )
  }

  return defineConfig({
    files: ["**/*.vue"],
    extends: configs,
  })
}
