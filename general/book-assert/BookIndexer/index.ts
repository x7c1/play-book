import { BookLoader, Chapter } from "book-assert";
import { confirm, DirectoryPath } from "../../file-paths/DirectoryPath";
import { confirm as confirmFile } from "../../file-paths/FilePath";
import * as path from "path";
import { ReadmeHeading } from "../summary";

export type ChapterLoader = (chapterNumber: number) => Promise<Chapter | null>;

class Indexer {
  constructor(private readme: ReadmeHeading, private chapterDirs: string[]) {}

  chapter(chapterDir: string): Indexer {
    const chapterDirs = this.chapterDirs.concat(chapterDir);
    return new Indexer(this.readme, chapterDirs);
  }

  async buildLoader(root: string, loader: ChapterLoader): Promise<BookLoader> {
    const chapters = await this.chapterDirs.reduce(
      async (acc, _) => (await acc).concat(await confirm.fromRelative(root, _)),
      Promise.resolve([] as DirectoryPath[]),
    );
    return new BookLoader(root, loader, this.readme, chapters);
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
  readme: ReadmeHeading;
  chapters: string[];
}): BookIndexer {
  const indexer = new Indexer(args.readme, []);
  return args.chapters.reduce((a, b) => a.chapter(b), indexer);
}
