import { confirm, DirectoryPath } from "../DirectoryPath";
import * as path from "path";
import { Book } from "book-assert";

class Indexer {
  constructor(
    private readmePath: string,
    private chapterDirs: (root: string) => Promise<DirectoryPath[]>,
  ) {}

  chapter(chapterDir: string): Indexer {
    const chapterDirs = async (root: string) => {
      const dirs = await this.chapterDirs(root);
      const dir = await confirm(path.resolve(root, chapterDir));
      return dirs.concat(dir);
    };
    return new Indexer(this.readmePath, chapterDirs);
  }

  runAt(root: string): Promise<Book> {
    // todo: include chapterDirs in Book instance
    return Promise.resolve(new Book(this.readmePath));
  }
}

export interface BookIndexer {
  runAt(root: string): Promise<Book>;
}

export function BookIndexer(args: {
  readme: string;
  chapters: string[];
}): BookIndexer {
  const indexer = new Indexer(args.readme, () => Promise.resolve([]));
  return args.chapters.reduce((a, b) => a.chapter(b), indexer);
}
