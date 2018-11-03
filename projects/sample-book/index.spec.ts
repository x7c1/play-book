import { generator } from "./index"
import { expect } from "chai"

describe("generator.run", () => {
  const book = generator.run()

  describe("book", () => {
    it("should have intro", () => {
      expect(book.intro).to.not.eq(undefined)
    })
    it("should have chapters", () => {
      expect(book.countDivisions()).to.gt(0)
    })
  })
})
