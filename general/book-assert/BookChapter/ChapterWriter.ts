import { promisify } from "util";
import { writeFile } from "fs";
import { BookLoader } from "../BookLoader";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { dirname } from "path";
import { mkdirs } from "fs-extra";

export class ChapterWriter {
  constructor(private loader: BookLoader) {}

  async generateTo(dir: DirectoryPath): Promise<void> {
    const chapters = await this.loader.loadBookChapters();
    return chapters.contents.reduce((promise, content) => {
      const absolute = dir.resolve(content.filePath.toRelative);
      return promise
        .then(() => promisify(mkdirs)(dirname(absolute)))
        .then(() => promisify(writeFile)(absolute, content.markdownString));
    }, Promise.resolve());
  }
}
