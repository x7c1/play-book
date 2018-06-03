import { BookReadme } from "../BookReadme";
import { promisify } from "util";
import { FilePath } from "../../file-paths/FilePath";
import { readFile } from "fs";

export class ReadmeLoader {
  constructor(private readmePath: FilePath) {}

  async loadReadme(): Promise<BookReadme> {
    return {
      markdownString: await this.readFile(this.readmePath),
      filePath: this.readmePath,
    };
  }

  private async readFile(file: FilePath) {
    return promisify(readFile)(file.toAbsolute, "utf-8");
  }
}
