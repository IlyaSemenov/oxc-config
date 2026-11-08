import fs from "fs"

/** @returns */
export function read(path: string) {
  if (!path) return ""
  return fs.readFileSync(__dirname + "/" + path, "utf8")
}

export type Callback = Function

export let counter = 0

export const digits = /[0-9]+/

it("reads", () => {
  console.log(read(""), counter)
})

test.only("focused", () => {})
