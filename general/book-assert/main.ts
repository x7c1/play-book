import * as path from "path";
import { Chapter } from "./Chapter";
import { createCommand } from "./command";
import { Book } from "./Book";

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
    loader: {
      loadBook() {
        const file = path.resolve(scriptsDir, docsDir);
        return load(file).book as Book;
      },
      loadChapter() {
        const file = path.resolve(scriptsDir, docsDir, command.chapter);
        return load(file).chapter as Chapter;
      },
    },
    command,
  };
};

const promiseOf = (settings: Settings) => {
  const { command, loader } = parse(settings);
  if (command.serve) {
    return loader.loadBook().serve(settings.docsDir, settings.gitbookRoot);
  }
  if (command.chapter && command.section && command.single) {
    return loader.loadChapter().assertSection(command.section);
  }
  if (command.chapter && command.single) {
    return loader.loadChapter().assertSections();
  }
  throw new Error("not implemented");
};

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
