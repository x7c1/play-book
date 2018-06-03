import { readFile } from "fs";
import { promisify } from "util";
import { BookReadme } from "../BookReadme";
import { FilePath } from "../../file-paths/FilePath";
import { ReadmeHeading } from "../summary";
import { warning } from "./warning";

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
    return this.readFile(this.readme.filePath).then(_ => warning + "\n" + _);
  }

  private async readFile(file: FilePath) {
    return promisify(readFile)(file.toAbsolute, "utf-8");
  }
}
