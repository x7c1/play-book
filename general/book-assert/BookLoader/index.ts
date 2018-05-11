import { ChapterHeading, ReadmeHeading, Summary } from "../summary";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { FilePath } from "../../file-paths/FilePath";
import { promisify } from "util";
import { readFile } from "fs";
import * as md from "markdown-it";
import * as cheerio from "cheerio";

export class BookLoader {
  constructor(
    private root: string,
    private readmePath: FilePath,
    private chapterPaths: DirectoryPath[],
  ) {}

  async loadSummary(): Promise<Summary> {
    return {
      readme: await this.loadReadme(),
      chapters: await this.loadChapters(),
    };
  }

  private async loadReadme(): Promise<ReadmeHeading> {
    console.log("loadReadme", this.readmePath);

    return {
      title: "readme title",
      path: this.readmePath.toRelative,
    };
  }

  private async loadChapters(): Promise<ChapterHeading[]> {
    console.log("loadChapters", this.chapterPaths);
    return Promise.all(this.chapterPaths.map(loadChapter));
  }
}

async function loadChapter(path: DirectoryPath): Promise<ChapterHeading> {
  const index = await path.withParent.confirmFile("index.md");
  const fromMarkdown = (markdown: string) => md().render(markdown);
  const fromHtml = (html: string) => {
    const $ = cheerio.load(html);
    const h1 = $("h1").text();
    return {
      title: h1,
      path: index.toRelative,
      sections: [],
    };
  };
  return promisify(readFile)(index.toAbsolute, "utf-8")
    .then(fromMarkdown)
    .then(fromHtml);
}

const sampleSection = {
  title: "section title",
  path: "./section",
};

const sampleChapter = {
  title: "chapter-title",
  path: "./chapter",
  sections: [sampleSection],
};
