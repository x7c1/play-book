import { confirm, DirectoryPath } from "./DirectoryPath";
import * as path from "path";

export interface Readme {
  title: string;
  path: string;
}

export class Book {
  private constructor(
    private root: string,
    private readmePath: string,
    private chapterDirs: Promise<DirectoryPath[]> = Promise.resolve([]),
  ) {}

  static create(args: { root: string; readmePath: string }): Book {
    return new Book(args.root, args.readmePath);
  }

  appendChapter(chapterDir: string): Book {
    const chapterDirs = async () => {
      const dirs = await this.chapterDirs;
      const dir = await confirm(path.resolve(this.root, chapterDir));
      return dirs.concat(dir);
    };
    return new Book(this.root, this.readmePath, chapterDirs());
  }

  get readme(): Readme {
    return {
      title: "readme title",
      path: this.readmePath,
    };
  }
}
