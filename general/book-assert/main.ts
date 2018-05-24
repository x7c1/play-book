import * as path from "path";
import { BookLoader } from "./BookLoader";
import { Chapter } from "./Chapter";
import { createCommand } from "./command";
import { serve } from "./serve";

export interface Settings {
  argv: string[];
  scriptsDir: string;
  docsDir: string;
  gitbookRoot: string;
  load: (id: string) => any;
}

const parse = (settings: Settings) => {
  const { scriptsDir, docsDir, load } = settings;
  const command = createCommand(settings.argv);
  return {
    createLoader(): Promise<BookLoader> {
      const file = path.resolve(scriptsDir, docsDir);
      return load(file).default.runAt(docsDir);
    },
    async loadChapter(): Promise<Chapter> {
      const file = path.resolve(scriptsDir, docsDir);
      const chapterPath = await load(file).default.loadChapterPath(
        docsDir,
        command.chapter,
      );
      return load(chapterPath.toRelative).chapter as Chapter;
    },
    command,
  };
};

async function promiseOf(settings: Settings): Promise<void> {
  const { command, loadChapter, createLoader } = parse(settings);
  if (command.serve) {
    return serve(createLoader)({
      src: settings.docsDir,
      dst: settings.gitbookRoot,
    });
  }
  if (command.chapter && command.section && command.single) {
    return (await loadChapter()).assertSection(command.section);
  }
  if (command.chapter && command.single) {
    return (await loadChapter()).assertSections();
  }
  throw new Error("not implemented");
}

export const main = (settings: Settings) => {
  promiseOf(settings).catch(err => {
    console.error("[unexpected]", err);
    if (err.stdout) {
      console.error("[stdout]", err.stdout);
    }
    if (err.stderr) {
      console.error("[stderr]", err.stderr);
    }
    process.exit(1);
  });
};
