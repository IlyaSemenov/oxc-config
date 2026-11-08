import { afterAll, expect, test } from "bun:test"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { ESLint } from "eslint"

import createConfig from "../src/eslint"

const fixtures = join(import.meta.dir, "fixtures")
const temporary = mkdtempSync(join(tmpdir(), "oxc-config-"))
afterAll(() => rmSync(temporary, { recursive: true, force: true }))

const oxlint = join(import.meta.dir, "../node_modules/.bin/oxlint")
const oxlintConfig = join(import.meta.dir, "../src/oxlint.ts")

/** Lint a fixture copied under `target` name and return the reported rule codes. */
async function lintCodes(fixture: string, target: string) {
  const path = join(temporary, target)
  await Bun.write(path, Bun.file(join(fixtures, fixture)))
  const result = Bun.spawnSync([oxlint, "--config", oxlintConfig, "--format", "json", path])
  const { diagnostics } = JSON.parse(result.stdout.toString()) as {
    diagnostics: { code: string }[]
  }
  return diagnostics.map(diagnostic => diagnostic.code).toSorted()
}

test("rule families", async () => {
  // The fixture is linted as a test file: oxlint applies some test rules to test files only.
  expect(await lintCodes("rules.ts", "rules.test.ts")).toEqual(
    [
      "eslint(curly)",
      "eslint(no-console)",
      "eslint(prefer-const)",
      "import(no-mutable-exports)",
      "jsdoc(require-returns-description)",
      "node(no-path-concat)",
      "regexp(prefer-d)",
      "typescript(no-unsafe-function-type)",
      "unicorn(prefer-node-protocol)",
      "vitest(consistent-test-it)",
      "vitest(no-focused-tests)",
    ].toSorted(),
  )
})

test("global declarations", async () => {
  expect(await lintCodes("globals.d.ts", "globals.d.ts")).toEqual([])
})

for (const name of ["imports", "named-imports"]) {
  test(name, async () => {
    const path = join(temporary, `${name}.ts`)
    await Bun.write(path, Bun.file(join(fixtures, `${name}.ts`)))
    const result = Bun.spawnSync([oxlint, "--config", oxlintConfig, "--fix", path])
    // Oxlint may report already-fixed diagnostics; the file is the expected result.
    expect([0, 1], result.stderr.toString() || result.stdout.toString()).toContain(result.exitCode)
    expect(await Bun.file(path).text()).toBe(
      await Bun.file(join(fixtures, `${name}.fixed.ts`)).text(),
    )
  })
}

for (const template of ["html", "pug"]) {
  test(`Vue ${template}`, async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: await createConfig(template === "pug" ? { vuePug: true } : undefined),
      fix: true,
    })
    const input = await Bun.file(join(fixtures, `Card.${template}.vue`)).text()
    const [result] = await eslint.lintText(input, { filePath: `Card.${template}.vue` })
    expect(result!.output).toBe(await Bun.file(join(fixtures, `Card.${template}.fixed.vue`)).text())
    expect(result!.messages).toEqual([
      expect.objectContaining({
        ruleId: "@typescript-eslint/no-unused-vars",
        message: expect.stringContaining("'unused'"),
      }),
    ])
  })
}
