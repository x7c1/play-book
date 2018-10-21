import { world } from "./sample"
import { expect } from "chai"

describe("hello", () => {
  it("should return hello world", () => {
    expect(world).to.equal("hello, world")
  })
})
