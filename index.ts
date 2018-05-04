import { Chapter, main } from "book-assert";

main({
  docsDir: "./docs",
  outDir: "./ts.book-assert.gen",
  loader: id => require(id).chapter as Chapter,
  argv: process.argv,
});
