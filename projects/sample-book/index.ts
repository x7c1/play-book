import { BookGenerator, start } from "book-assert/BookGenerator"

export const generator: BookGenerator =
  start("./intro")
    .chapters([
      "./about",
      "./setup",
    ])
