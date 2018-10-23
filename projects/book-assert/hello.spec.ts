import { expect } from "chai"
import { hello } from "./hello"

describe("hello", () => {
  it("should return greeting", () => {
    const greeting = hello("world")
    expect(greeting).to.equal("hello, world!")
  })
})
