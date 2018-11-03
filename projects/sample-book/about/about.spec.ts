import { expect } from "chai"
import { generator } from "../index"

describe("chapter [./about]", () => {
  const book = generator.run()
  const chapter = book.findDivision("./about")!

  it("should have a relative path", () => {
    expect(chapter.relativePath).to.equal("./about")
  })
})
