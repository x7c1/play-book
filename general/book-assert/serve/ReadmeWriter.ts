import { BookLoader } from "../BookLoader";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { promisify } from "util";
import { writeFile } from "fs";

export class ReadmeWriter {
  constructor(private loader: BookLoader) {}

  async generateTo(dir: DirectoryPath): Promise<void> {
    const readme = await this.loader.loadBookReadme();
    return promisify(writeFile)(
      dir.resolve(readme.filePath.toRelative),
      readme.markdownString,
    );
  }
}
