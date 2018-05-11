import { BookLoader } from "../BookLoader";
import { DirectoryPath } from "../../file-paths/DirectoryPath";

export class SummaryWriter {
  constructor(private loader: BookLoader) {}

  async generateTo(dir: DirectoryPath): Promise<void> {
    const summary = await this.loader.loadSummary();
    const summaryPath = dir.resolve("SUMMARY2.md");

    // todo: dump summary to summaryPath as a Markdown
    console.log(summary, summaryPath);
  }
}
