import { greeting } from "./sample"
import { expect } from "chai"

describe("greeting", () => {
  it("should return hello world", () => {
    expect(greeting).to.equal("hello, world!")
  })
})
