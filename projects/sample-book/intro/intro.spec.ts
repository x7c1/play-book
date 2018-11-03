import { expect } from "chai"
import { generator } from "../index"

describe("book.start", () => {
  const book = generator.run()
  const intro = book.findDivision("./intro")!

  it("should have a relative path", () => {
    expect(intro.relativePath).to.equal("./intro")
  })
})
