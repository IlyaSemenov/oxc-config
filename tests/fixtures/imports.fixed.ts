import "./setup"

import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

import external from "external"

import type { Value } from "#types"
import { value } from "#types"
import { web } from "#web/service"
import { backend } from "#web-backend/service"

import parent from "../parent"

import sibling from "./sibling"

export { backend, web, join, expect, test, readFile, sibling, parent, external, value }
export type { Value }
