import { main } from "book-assert";

main({
  argv: process.argv,
  scriptsDir: "./book-assert.ts.gen",
  docsDir: "./docs",
  gitbookRoot: "./book-assert.docs",
  load: id => require(id),
});
