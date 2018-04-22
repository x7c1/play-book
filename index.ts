import { Chapter } from "book_assert";

const assertChapter = (dir: string) => {
  const chapter = require(dir).chapter as Chapter;
  return chapter.assertSections().catch((err: any) => {
    if (err) {
      console.error("[unexpected]", err);
    }
    process.exit(1);
  });
};

assertChapter("./docs/002");
