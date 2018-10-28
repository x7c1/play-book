import { generator } from "./index"
import { expect } from "chai"

describe("generator.run", () => {
  const book = generator.run()

  describe("book", () => {
    it("should have start", () => {
      expect(book.start).to.not.eq(undefined)
    })
    it("should have chapters", () => {
      expect(book.chapters.length).to.gt(0)
    })
  })
})
