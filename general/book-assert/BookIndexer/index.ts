import { BookLoader } from "book-assert";
import { fromRelative, DirectoryPath } from "../DirectoryPath";

class Indexer {
  constructor(private readmePath: string, private chapterDirs: string[]) {}

  chapter(chapterDir: string): Indexer {
    const chapterDirs = this.chapterDirs.concat(chapterDir);
    return new Indexer(this.readmePath, chapterDirs);
  }

  async runAt(root: string): Promise<BookLoader> {
    const paths = await this.chapterDirs.reduce(
      async (acc, _) => (await acc).concat(await fromRelative(root, _)),
      Promise.resolve([] as DirectoryPath[]),
    );
    return new BookLoader(root, this.readmePath, paths);
  }
}

export interface BookIndexer {
  runAt(root: string): Promise<BookLoader>;
}

export function BookIndexer(args: {
  readme: string;
  chapters: string[];
}): BookIndexer {
  const indexer = new Indexer(args.readme, []);
  return args.chapters.reduce((a, b) => a.chapter(b), indexer);
}
