# @ilyasemenov/oxc-config Agent Guide

## Overview

Reusable oxlint, oxfmt, and ESLint configurations.

Read [README.md](README.md) completely before changing the public API, package behavior, supported runtimes, or user documentation.

Extend this guide only with stable, non-obvious conventions, architecture, contracts, workflows, and gotchas.
Do not catalog files or restate information evident from their names and locations.

## Scope

- Keep production code in `src/`.
- Keep focused module tests beside their source as `*.test.ts`.
- Keep integration, package-boundary, and type-inference tests in `tests/`.
- Name compile-only tests `*.type-test.ts`.
- Treat `package.json` exports and supported runtimes as public contracts.

## Documentation

- Write repository documentation, comments, examples, and diagnostic messages in English.
- Keep consumer-specific migration notes and task reports out of package documentation and published files.
- Write public README and JSDoc text for package users who do not know the implementation.
- Add JSDoc to every exported declaration and to internal helpers whose contract, inputs, output, or failure behavior is not obvious.
- Add inline comments beside every non-obvious invariant, algorithmic choice, safety constraint, and intentionally limited behavior.
- Preserve applicable rule comments when transferring or restructuring configs.
- Update nearby JSDoc and inline comments whenever the documented code changes, and remove comments that no longer apply.
- Do not narrate self-evident syntax or restate what a name already communicates.
- Do not document obvious or implied defaults.
- Describe a default only when readers need it to make a decision or avoid surprising behavior.
- Use One Sentence Per Line for connected prose.
- Keep semantically connected explanations as prose paragraphs.
- Use lists for separate assertions instead of presenting them as prose paragraphs.

## Changesets

- Add one `.changeset/*.md` file for each independently releasable user-visible change.
- Do not add changesets for internal refactors, maintenance, tests, or documentation changes that do not require a package release.
- Choose the SemVer bump from the public contract: `patch` for backward-compatible fixes and `minor` for backward-compatible functionality.
- Before 1.0, use `minor` for breaking changes; starting with 1.0, use `major` and remove this rule.
- Create `.changeset/<unique-name>.md` with this format:

```markdown
---
"@ilyasemenov/oxc-config": patch
---

Describe the user-visible change.
```

- Briefly describe the user-observable change or new capability in the public contract, without implementation details or rationale.
  Prefer a single sentence.
- Do not edit the package version or `CHANGELOG.md` by hand, and do not run `changeset version` or `changeset publish`; the release workflow consumes pending changesets.

## Tests

- Test observable invariants using independently specified inputs and expected results.
- Do not copy production configs or algorithms into tests as an expected result.

- Add a `describe` block where the file gives a reason for it: several APIs or behaviors in one file, or a fixture that belongs to some cases but not all.
  Name such a block after what it covers and keep its fixtures inside it.
- Distinguish several same-kind values by role rather than by order.
  When values differ only by order, number them with digits instead of ordinal words.
- Keep tests deterministic so a failure repeats on every run.
  Generate random inputs from an explicit seed and print the seed in failure messages so the failing input can be replayed.

## Checks

- Run the `types` script when public types or TypeScript configuration change.
- Run the `test` script when behavior changes.
- Run the `build` script when package exports, declarations, or supported runtimes change.

## Config contracts

- Keep all 3 subpath exports independent and omit the root entry point.
- Keep project import mappings and restricted imports out of the shared configs.
- Resolve perfectionist from the package module, not the consumer directory.
- Pair the Vue oxlint unused-variable override with the template-aware ESLint rule.
- Scope the entire ESLint config to Vue SFCs.
- Keep Pug disabled by default and load its optional peer only when `vuePug: true` is requested.
- Keep personal Vue rules, personal Pug rules, and tool compatibility settings in separate named config blocks.
- Keep import sorting in oxlint and leave it disabled in oxfmt.
- Test source configs directly against adjacent input and expected-output fixtures.
- Keep intentionally invalid fixture inputs excluded from repository linting and formatting.
- Keep TypeScript within the supported typescript-eslint peer range.
