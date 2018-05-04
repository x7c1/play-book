import { Chapter, main } from "book-assert";

main({
  docsDir: "./docs",
  outDir: "./docs-gen",
  loader: id => require(id).chapter as Chapter,
  argv: process.argv,
});
