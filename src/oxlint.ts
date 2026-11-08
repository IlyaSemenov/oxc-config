import { Alphabet } from "eslint-plugin-perfectionist/alphabet"
import regexp from "eslint-plugin-regexp"
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

/**
 * Code quality rules close to `@antfu/eslint-config`, import sorting, and Vue script rules,
 * paired with the ESLint entry point.
 */
export default defineConfig({
  plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "jsdoc", "node", "vitest"],
  // Imported config objects resolve bare specifiers from the consumer, so resolve here.
  jsPlugins: [
    import.meta.resolve("eslint-plugin-perfectionist"),
    import.meta.resolve("eslint-plugin-regexp"),
  ],
  categories: {
    // Warnings don't fail the run, so bugs must be errors.
    correctness: "error",
  },
  rules: {
    // UNFINISHED: the rules below are hand-copied from @antfu/eslint-config and cannot be
    // verified or updated. Generate them instead before merging; see TODO.md.
    "accessor-pairs": ["error", { enforceForClassMembers: true, setWithoutGet: true }],
    "array-callback-return": "error",
    "block-scoped-var": "error",
    curly: ["error", "all"],
    "default-case-last": "error",
    eqeqeq: ["error", "smart"],
    "new-cap": ["error", { capIsNew: false, newIsCap: true, properties: true }],
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-case-declarations": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-fallthrough": "error",
    "no-implied-eval": "error",
    "no-labels": ["error", { allowLoop: false, allowSwitch: false }],
    "no-lone-blocks": "error",
    "no-multi-str": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-proto": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": ["error", { builtinGlobals: false }],
    "no-regex-spaces": "error",
    "no-restricted-globals": [
      "error",
      { name: "global", message: "Use `globalThis` instead." },
      { name: "self", message: "Use `globalThis` instead." },
    ],
    "no-restricted-properties": [
      "error",
      {
        property: "__proto__",
        message: "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
      },
      { property: "__defineGetter__", message: "Use `Object.defineProperty` instead." },
      { property: "__defineSetter__", message: "Use `Object.defineProperty` instead." },
      { property: "__lookupGetter__", message: "Use `Object.getOwnPropertyDescriptor` instead." },
      { property: "__lookupSetter__", message: "Use `Object.getOwnPropertyDescriptor` instead." },
    ],
    "no-self-compare": "error",
    "no-sequences": ["error", { allowInParentheses: true }],
    // Array holes are occasionally intended, e.g. to skip destructured elements.
    "no-sparse-arrays": "off",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    // Oxfmt breaks long call chains before `[…]` and `(…)`, which this rule reports.
    "no-unexpected-multiline": "off",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": ["error", { defaultAssignment: false }],
    "no-unreachable-loop": "error",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true },
    ],
    "no-unused-vars": [
      "error",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
        vars: "all",
        varsIgnorePattern: "^_",
      },
    ],
    "no-use-before-define": ["error", { classes: false, functions: false, variables: true }],
    "no-useless-call": "error",
    "no-useless-computed-key": "error",
    "no-useless-constructor": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "object-shorthand": ["error", "always", { avoidQuotes: true, ignoreConstructors: false }],
    "one-var": ["error", { initialized: "never" }],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: false, allowUnboundThis: true }],
    "prefer-const": ["error", { destructuring: "all", ignoreReadBeforeAssign: true }],
    "prefer-exponentiation-operator": "error",
    "prefer-promise-reject-errors": "error",
    "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "symbol-description": "error",
    "unicode-bom": ["error", "never"],
    "vars-on-top": "error",
    yoda: ["error", "never"],

    "typescript/consistent-type-imports": [
      "error",
      { disallowTypeAnnotations: false, fixStyle: "separate-type-imports", prefer: "type-imports" },
    ],
    "typescript/no-empty-object-type": ["error", { allowInterfaces: "always" }],
    "typescript/no-import-type-side-effects": "error",
    "typescript/no-namespace": "error",
    "typescript/no-non-null-asserted-nullish-coalescing": "error",
    "typescript/no-require-imports": "error",
    "typescript/no-unnecessary-type-constraint": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/prefer-literal-enum-member": "error",

    "unicorn/consistent-empty-array-spread": "error",
    "unicorn/error-message": "error",
    "unicorn/escape-case": "error",
    "unicorn/new-for-builtins": "error",
    "unicorn/no-instanceof-builtins": ["error", { strategy: "loose" }],
    "unicorn/no-new-buffer": "error",
    // unicorn/number-literal-case is left out: oxfmt lowercases hex digits, the rule uppercases them.
    "unicorn/prefer-dom-node-text-content": "error",
    "unicorn/prefer-includes": "error",
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-number-properties": ["error", { checkInfinity: false, checkNaN: false }],
    "unicorn/prefer-type-error": "error",
    "unicorn/throw-new-error": "error",

    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/no-mutable-exports": "error",
    "import/no-named-default": "error",

    "node/handle-callback-err": ["error", "^(err|error)$"],
    "node/no-exports-assign": "error",
    "node/no-new-require": "error",
    "node/no-path-concat": "error",

    "jsdoc/check-access": "warn",
    // TSDoc tags such as `@typeParam` and pragmas such as `@jsxImportSource` are valid.
    "jsdoc/check-tag-names": "off",
    "jsdoc/check-property-names": "warn",
    "jsdoc/empty-tags": "warn",
    "jsdoc/implements-on-classes": "warn",
    "jsdoc/no-defaults": "warn",
    "jsdoc/require-param-name": "warn",
    "jsdoc/require-property": "warn",
    "jsdoc/require-property-description": "warn",
    "jsdoc/require-property-name": "warn",
    // TypeScript provides the types.
    "jsdoc/require-property-type": "off",
    "jsdoc/require-returns-description": "warn",
    "jsdoc/require-yields": "off",

    "vitest/consistent-test-it": ["error", { fn: "test", withinDescribe: "test" }],
    "vitest/no-focused-tests": "error",
    "vitest/no-identical-title": "error",
    "vitest/no-import-node-test": "error",
    "vitest/prefer-hooks-in-order": "error",
    "vitest/prefer-lowercase-title": ["error", { ignoreTopLevelDescribe: false }],
    // Test style preferences from the correctness category, not bugs.
    // Assertions may live in helpers, skipped and todo tests are intentional.
    "vitest/expect-expect": "off",
    "vitest/no-conditional-expect": "off",
    "vitest/no-conditional-tests": "off",
    "vitest/no-disabled-tests": "off",
    "vitest/prefer-snapshot-hint": "off",
    "vitest/require-mock-type-parameters": "off",
    "vitest/require-to-throw-message": "off",
    "vitest/warn-todo": "off",

    ...regexp.configs["flat/recommended"].rules,

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
    "perfectionist/sort-exports": ["error", { type: "custom", alphabet }],
    "perfectionist/sort-named-exports": ["error", { type: "custom", alphabet }],
  },
  overrides: [
    {
      files: ["**/*.d.ts"],
      rules: {
        // `declare global { var … }` is the only way to declare a global variable.
        "no-var": "off",
        "vars-on-top": "off",
      },
    },
    {
      files: ["**/*.vue"],
      rules: {
        // ESLint checks variables used by Vue templates, including Pug.
        "no-unused-vars": "off",
      },
    },
  ],
})
