import { confirm, DirectoryPath } from "./DirectoryPath";
import * as path from "path";
import { Book } from "book-assert";

export class BookIndex {
  constructor(
    private readmePath: string,
    private chapterDirs: (root: string) => Promise<DirectoryPath[]> = () =>
      Promise.resolve([]),
  ) {}

  static create(readmePath: string): BookIndex {
    return new BookIndex(readmePath);
  }

  appendChapter(chapterDir: string): BookIndex {
    const chapterDirs = async (root: string) => {
      const dirs = await this.chapterDirs(root);
      const dir = await confirm(path.resolve(root, chapterDir));
      return dirs.concat(dir);
    };
    return new BookIndex(this.readmePath, chapterDirs);
  }

  toBook(root: string): Promise<Book> {
    // todo: include chapterDirs in Book instance
    return Promise.resolve(new Book(this.readmePath));
  }
}
