import { BookReadme } from "../BookReadme";
import { promisify } from "util";
import { FilePath } from "../../file-paths/FilePath";
import { readFile } from "fs";
import { ReadmeHeading } from "../summary";

export class ReadmeLoader {
  constructor(private readme: ReadmeHeading) {}

  async loadReadme(): Promise<BookReadme> {
    return {
      title: this.readme.title,
      markdownString: await this.loadMarkdownString(),
      filePath: this.readme.filePath,
    };
  }

  private loadMarkdownString(): Promise<string> {
    return this.readFile(this.readme.filePath);
  }

  private async readFile(file: FilePath) {
    return promisify(readFile)(file.toAbsolute, "utf-8");
  }
}
