import { generator } from "./index"
import { expect } from "chai"

describe("generator.run", () => {
  const book = generator.run()

  describe("book.head", () => {
    it("should have a relative path", () => {
      const start = book.start
      expect(start!.relativePath).to.equal("./intro")
    })
  })

  describe("book.chapter", () => {
    it("should have a relative path", () => {
      const chapter1 = book.chapter(1)
      expect(chapter1.relativePath).to.equal("./about")

      const chapter2 = book.chapter(2)
      expect(chapter2.relativePath).to.equal("./setup")
    })
  })
})
