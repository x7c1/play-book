import { expect } from "chai"
import { generator } from "../index"

describe("book.chapter(2)", () => {
  const book = generator.run()
  const chapter1 = book.chapter(2)

  it("should have a relative path", () => {
    expect(chapter1.relativePath).to.equal("./setup")
  })
})
