import { BookLoader } from "../BookLoader";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { promisify } from "util";
import { writeFile } from "fs";
import { ChapterHeading, Summary } from "./index";

export class SummaryWriter {
  constructor(private loader: BookLoader) {}

  async generateTo(dir: DirectoryPath): Promise<void> {
    const summary = await this.loader.loadSummary();
    const summaryPath = dir.resolve("SUMMARY.md");
    const content = new Formatter(summary).format();

    console.log("SummaryWriter#generateTo", summaryPath, summary, content);
    return promisify(writeFile)(summaryPath, content);
  }
}

class Formatter {
  constructor(private summary: Summary) {}

  format(): string {
    const first = ["# Summary", this.readme].join("\n\n");
    return [first].concat(this.chapters).join("\n\n--\n\n");
  }

  get readme(): string {
    return li(
      link(this.summary.readme.title, this.summary.readme.filePath.toRelative),
    );
  }

  get chapters(): string[] {
    const toString = (chapter: ChapterHeading) => {
      const pages = chapter.nextPages.map(page =>
        li(link(page.title, page.path), "  "),
      );
      return [li(link(chapter.title, chapter.path))].concat(pages).join("\n");
    };
    return this.summary.chapters.map(toString);
  }
}

function li(x: string, space: string = ""): string {
  return `${space}* ${x}`;
}

function link(title: String, path: String): string {
  return `[${title}](${path})`;
}
