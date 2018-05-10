import { BookLoader } from "../BookLoader";
import { DirectoryPath } from "../DirectoryPath";

export class SummaryGenerator {
  constructor(private loader: BookLoader) {}

  static fromLoader(book: BookLoader): SummaryGenerator {
    return new SummaryGenerator(book);
  }

  async generateTo(dir: DirectoryPath): Promise<void> {
    const summary = await this.loader.loadSummary();
    const summaryPath = dir.resolve("SUMMARY2.md");

    // todo: dump summary to summaryPath as a Markdown
    console.log(summary, summaryPath);
  }
}
