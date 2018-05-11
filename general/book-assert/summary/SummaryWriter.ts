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

    const formatter = new Formatter(summary);
    const content = formatter.format();

    // todo: dump summary to summaryPath as a Markdown
    console.log("generateTo", summary, summaryPath);
    console.log(content);

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
    return li(link(this.summary.readme.title, this.summary.readme.path));
  }

  get chapters(): string[] {
    const fromChapter = (chapter: ChapterHeading) => {
      return [li(link(chapter.title, chapter.path))]
        .concat(
          chapter.sections.map(section =>
            li(link(section.title, section.path), "  "),
          ),
        )
        .join("\n");
    };
    return this.summary.chapters.map(fromChapter);
  }
}

function li(x: string, space: string = ""): string {
  return `${space}* ${x}`;
}

function link(title: String, path: String): string {
  return `[${title}](${path})`;
}
