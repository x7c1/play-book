import { Book } from "../Book";
import { createSummary } from "./";
import { DirectoryPath } from "../DirectoryPath";

export class SummaryGenerator {
  constructor(private book: Book) {}

  static fromBook(book: Book): SummaryGenerator {
    return new SummaryGenerator(book);
  }

  generateTo(dir: DirectoryPath): Promise<void> {
    const summary = createSummary(this.book);
    const summaryPath = dir.resolve("SUMMARY2.md");

    // todo: dump summary to summaryPath as a Markdown
    console.log(summary, summaryPath);

    return Promise.resolve();
  }
}
