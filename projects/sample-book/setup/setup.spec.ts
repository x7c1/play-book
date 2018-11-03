import { expect } from "chai"
import { generator } from "../index"

describe("chapter [./setup]", () => {
  const book = generator.run()
  const chapter = book.findDivision("./setup")!

  it("should have a relative path", () => {
    expect(chapter.relativePath).to.equal("./setup")
  })
})
