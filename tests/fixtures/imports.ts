import "./setup"
import { backend } from "#web-backend/service"
import { web } from "#web/service"
import { join } from "node:path"
import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import sibling from "./sibling"
import parent from "../parent"
import external from "external"
import { value } from "#types"
import type { Value } from "#types"

export { backend, web, join, expect, test, readFile, sibling, parent, external, value }
export type { Value }
