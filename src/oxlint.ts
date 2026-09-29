import { Alphabet } from "eslint-plugin-perfectionist/alphabet"
import { defineConfig } from "oxlint"

// Keep package subpaths together: `pkg`, `pkg/subpath`, `pkg-extra`.
// See https://github.com/azat-io/eslint-plugin-perfectionist/issues/518
const alphabet = Alphabet.generateRecommendedAlphabet()
  .sortByNaturalSort()
  .placeCharacterBefore({ characterBefore: "/", characterAfter: "-" })
  .placeCharacterBefore({ characterBefore: ".", characterAfter: "/" })
  .getCharacters()
  // Oxlint cannot serialize lone UTF-16 surrogates.
  .replaceAll(/[\uD800-\uDFFF]/g, "")

/** Import sorting and Vue script rules, paired with the ESLint entry point. */
export default defineConfig({
  // Imported config objects resolve bare specifiers from the consumer, so resolve here.
  jsPlugins: [import.meta.resolve("eslint-plugin-perfectionist")],
  rules: {
    // Oxfmt's sortImports supports groups, but not a custom alphabet or fallbackSort.
    // Perfectionist keeps `pkg/subpath` before `pkg-extra` and puts type imports
    // before value imports from the same module. Keep oxfmt's sortImports disabled.
    "perfectionist/sort-imports": [
      "error",
      {
        type: "custom",
        alphabet,
        environment: "bun",
        groups: [
          "side-effect",
          "builtin",
          "external",
          "internal",
          "parent",
          ["sibling", "index"],
          "unknown",
        ],
        internalPattern: ["^~", "^#", "^@/"],
        newlinesBetween: 1,
        fallbackSort: { type: "type-import-first" },
      },
    ],
    "perfectionist/sort-named-imports": ["error", { type: "custom", alphabet, ignoreAlias: true }],
  },
  overrides: [
    {
      files: ["**/*.vue"],
      rules: {
        // ESLint checks variables used by Vue templates, including Pug.
        "no-unused-vars": "off",
      },
    },
  ],
})
