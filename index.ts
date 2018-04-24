import { Chapter, main } from "book-assert";

main({
  docs: "./docs",
  outDir: "./docs-gen",
  loader: id => require(id).chapter as Chapter,
  argv: process.argv,
});
