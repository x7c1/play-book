import { BookLoader, Chapter } from "book-assert";
import { confirm, DirectoryPath } from "../../file-paths/DirectoryPath";
import { confirm as confirmFile } from "../../file-paths/FilePath";
import * as path from "path";

export type ChapterLoader = (chapterNumber: number) => Promise<Chapter | null>;

export type ReadmeSetting = {
  title: string;
  path: string;
};

class Indexer {
  constructor(private readme: ReadmeSetting, private chapterDirs: string[]) {}

  chapter(chapterDir: string): Indexer {
    const chapterDirs = this.chapterDirs.concat(chapterDir);
    return new Indexer(this.readme, chapterDirs);
  }

  async buildLoader(root: string, loader: ChapterLoader): Promise<BookLoader> {
    const chapters = await this.chapterDirs.reduce(
      async (acc, _) => (await acc).concat(await confirm.fromRelative(root, _)),
      Promise.resolve([] as DirectoryPath[]),
    );
    const readme = {
      title: this.readme.title,
      filePath: await confirmFile.fromRelative(root, this.readme.path),
    };
    return new BookLoader(root, loader, readme, chapters);
  }

  loadChapterPath(root: string, chapterNumber: number): Promise<DirectoryPath> {
    const filePath = path.join(root, this.chapterDirs[chapterNumber - 1]);
    return confirm.fromCurrent("./" + filePath);
  }
}

export interface BookIndexer {
  buildLoader(root: string, loader: ChapterLoader): Promise<BookLoader>;
}

export function BookIndexer(args: {
  readme: ReadmeSetting;
  chapters: string[];
}): BookIndexer {
  const indexer = new Indexer(args.readme, []);
  return args.chapters.reduce((a, b) => a.chapter(b), indexer);
}
