import { expect } from "chai"
import { generator } from "../index"

describe("book.head", () => {
  const book = generator.run()

  it("should have a relative path", () => {
    const start = book.start
    expect(start!.relativePath).to.equal("./intro")
  })
})
