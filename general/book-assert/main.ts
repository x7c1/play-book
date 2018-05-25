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
  const file = path.resolve(scriptsDir, docsDir);
  const loadChapter = async (chapterNumber: number) => {
    const chapterPath = await load(file).default.loadChapterPath(
      docsDir,
      chapterNumber,
    );
    try {
      const module = load(chapterPath.toRelative);
      return (module.chapter as Chapter) || null;
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND") {
        throw e;
      }
      return null;
    }
  };
  return {
    createLoader(): Promise<BookLoader> {
      return load(file).default.buildLoader(docsDir, loadChapter);
    },
    async loadChapter(): Promise<Chapter> {
      const chapter = await loadChapter(command.chapter);
      if (chapter) {
        return chapter;
      }
      throw new Error(`no assertions for chapter:${command.chapter}`);
    },
    command,
  };
};

async function promiseOf(settings: Settings): Promise<void> {
  const { command, createLoader, loadChapter } = parse(settings);
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
  throw new Error("invalid pattern");
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
