import { Chapter } from "book-assert";

const chapterOf = (dir: string) => ({
  run: (f: (chapter: Chapter) => Promise<void>) => {
    const chapter = require(dir).chapter as Chapter;
    f(chapter).catch(err => {
      console.error("[unexpected]", err);
      if (err.stdout) {
        console.error("[stdout]", err.stdout);
      }
      if (err.stderr) {
        console.error("[stderr]", err.stderr);
      }
      process.exit(1);
    });
  },
});

const assertChapter = (dir: string) => {
  chapterOf(dir).run(_ => _.assertSections());
};

const assertSection = (dir: string, sectionLabel: string) => {
  chapterOf(dir).run(_ => _.assertSection(sectionLabel));
};

assertChapter("./docs/002");
