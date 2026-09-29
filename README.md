# @ilyasemenov/oxc-config

Reusable oxlint, oxfmt, and ESLint configurations for projects I develop or oversee.

Code is linted with oxlint and formatted with oxfmt.
For Vue, ESLint additionally lints and formats templates, which oxlint cannot do.
Both HTML and Pug templates are supported.

## Setup

Install:

```sh
npm install -D @ilyasemenov/oxc-config oxlint oxfmt
```

Create `oxlint.config.ts`:

```ts
import base from "@ilyasemenov/oxc-config/oxlint"
import { defineConfig } from "oxlint"

export default defineConfig({
  extends: [base],
})
```

Create `oxfmt.config.ts`:

```ts
export { default } from "@ilyasemenov/oxc-config/oxfmt"
```

To change formatting options, spread the config into your own: `defineConfig({ ...base, printWidth: 100 })`.

### Vue

For Vue projects, also install:

```sh
npm install -D eslint @antfu/eslint-config typescript-eslint typescript@~6.0.3
```

typescript-eslint doesn't support TypeScript 6.1+ yet.

Create `eslint.config.js`:

```js
// @ts-check

import config from "@ilyasemenov/oxc-config/eslint"

export default await config()
```

It uses the Vue rules from [@antfu/eslint-config](https://github.com/antfu/eslint-config) with my preferences on top, and only checks `.vue` files.
The oxlint config leaves unused variables in Vue files to ESLint, so use both.

To add your own Vue rules:

```js
// @ts-check

import config from "@ilyasemenov/oxc-config/eslint"
import { defineConfig } from "eslint/config"

export default defineConfig({
  files: ["**/*.vue"],
  extends: [await config()],
  rules: {
    "vue/require-v-for-key": "error",
  },
})
```

### Pug

For Pug templates, install:

```sh
npm install -D eslint-plugin-vue-pug@flat
```

As of 29.09.2026, the `latest` tag still points to the older 0.x version.
Then enable Pug in `eslint.config.js`:

```js
// @ts-check

import config from "@ilyasemenov/oxc-config/eslint"

export default await config({ vuePug: true })
```

The Pug preset disables some HTML checks for all Vue files, so enable it only in Pug projects.

## A few preferences

- No semicolons.
- Imports grouped as side effects, builtins, external, internal, parent, sibling/index, and unknown, with a blank line between groups.
- `bun:*` imports grouped with `node:*`; `~`, `#`, and `@/` treated as internal prefixes.
- Package subpaths kept together: `#app/…` before `#app-server/…`.
- Named imports sorted by their original name, ignoring aliases; type imports before value imports from the same module.
- Vue component names in kebab-case, for both HTML and Pug.
- No empty component blocks; `v-for` without a key and string concatenation are allowed.

Imports are sorted by Perfectionist in oxlint: oxfmt's `sortImports` doesn't support this order, so keep it disabled.

## Running it

```sh
npx oxlint --fix
npx eslint --fix '**/*.vue'
npx oxfmt
```

Leave out the ESLint command in projects without Vue.
If you also use Stylelint, run it before oxfmt.

If an import needs both moving and sorting inside `{ … }`, oxlint needs a second `--fix` run ([oxc#16118](https://github.com/oxc-project/oxc/issues/16118)).

### Monorepos

Running oxlint from the root also loads configs of nested packages.
If they resolve different copies of the same JS plugin, oxlint fails with `Plugin name 'perfectionist' is already registered`.
If the root config covers all packages, pass it explicitly to skip nested configs:

```sh
npx oxlint --config oxlint.config.ts --fix
```

Otherwise, run oxlint from each package directory.

## Development

```sh
mise trust
mise install
bun install
bun test
bun run types
bun run build
bun run lint
```

Tests run directly against the source configs; there's no need to build first.
