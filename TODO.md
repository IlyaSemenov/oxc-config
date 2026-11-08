# UNFINISHED: antfu-like oxlint rules

This branch extends the oxlint config with code quality rules close to `@antfu/eslint-config`.
It is parked: the rules work and are tested, but they are not maintainable in their current form.
Do not merge it as is.

## Problem

`src/oxlint.ts` contains about 100 rules with options copied by hand from `@antfu/eslint-config`.
Nobody can verify that they match antfu, and they silently drift when antfu or oxlint is updated.

## Plan

Generate the antfu part with [`@oxlint/migrate`](https://www.npmjs.com/package/@oxlint/migrate), which converts an ESLint flat config to an oxlint config with the natively supported rules and their options.
Split the config into 3 layers:

1. A generated file, such as `src/antfu.generated.json`.
   - A `generate` script runs `@oxlint/migrate` over the antfu blocks: javascript, typescript, unicorn, imports, node, jsdoc, test, regexp.
   - Never edit it by hand; to update, bump antfu or oxlint, run `generate`, and review the diff.
   - A test checks that regeneration produces the committed file.
2. Hand-written deviations from antfu, each with a reason:
   - personal preferences from the old `@ilyasemenov/eslint-config`: `curly: all`, `no-console: warn`, and similar;
   - conflicts with oxfmt;
   - noisy correctness rules that antfu doesn't enable;
   - the `.d.ts` override.
3. Oxlint and package specifics: `categories.correctness: "error"`, perfectionist, the Vue override.

Before rewriting `src/oxlint.ts`, diff the generated rules against the hand-written ones: mismatches show mistakes in the current copy.
Check what `@oxlint/migrate` cannot convert, such as prefix renames (`ts/` to `typescript/`, `test/` to `vitest/`) and regexp as a JS plugin, and list it explicitly in the generator.

## Decisions

- Keep `no-restricted-imports` out of the shared config, per the config contracts in `AGENTS.md`.
  Oxlint test rules don't recognize `bun:test`, so projects forbid `it` from `bun:test` themselves; README shows the snippet.
- Report correctness rules as errors: warnings don't fail the run.
- Sorting of named exports (`perfectionist/sort-exports`, `sort-named-exports`) is independent of antfu and may be merged separately.

## Findings

- `no-unexpected-multiline` reports how oxfmt breaks long call chains; keep it off.
- `unicorn/number-literal-case` uppercases hex digits, oxfmt lowercases them; keep it out.
- Noisy correctness rules turned off: `vitest/expect-expect`, `no-conditional-expect`, `no-conditional-tests`, `no-disabled-tests`, `prefer-snapshot-hint`, `require-mock-type-parameters`, `require-to-throw-message`, `warn-todo`; `jsdoc/check-tag-names` (rejects `@typeParam`, `@jsxImportSource`), `require-yields`, `require-property-type`; `no-sparse-arrays`.
- `.d.ts` files need `no-var` and `vars-on-top` off for `declare global { var … }`.
- Antfu rules oxlint cannot run: `antfu/*`, `e18e/*`, `eslint-comments/*`, `node/prefer-global/*`, `no-restricted-syntax` (`const enum` ban), `jsdoc/check-param-names`, `unused-imports` with autofix removal.
- `eslint-plugin-regexp` as a JS plugin raised oxlint time on brainforce from 1.7 to 2.4 s.
- On brainforce, which was already clean under antfu, the config reported 78 issues, almost all from the noisy rules turned off above.

## Before merging

- Implement the generator and the 3-layer split.
- Verify the result on a real project.
- Delete this file and the UNFINISHED comment in `src/oxlint.ts`.
