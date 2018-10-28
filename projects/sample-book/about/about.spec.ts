import { expect } from "chai"
import { generator } from "../index"

describe("chapter.1", () => {
  const book = generator.run()
  const chapter1 = book.findChapterByNumber(1)!

  it("should have a relative path", () => {
    expect(chapter1.relativePath).to.equal("./about")
  })
})
