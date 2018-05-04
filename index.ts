import { Chapter, main } from "book-assert";

main({
  docsDir: "./docs",
  outDir: "./book-assert.ts.gen",
  loader: id => require(id).chapter as Chapter,
  argv: process.argv,
});
