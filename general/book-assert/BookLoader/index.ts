import { ChapterHeading, ReadmeHeading, Summary } from "../summary";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { FilePath } from "../../file-paths/FilePath";
import { promisify } from "util";
import { readFile } from "fs";
import * as md from "markdown-it";
import * as cheerio from "cheerio";
import { BookChapters, ChapterContent } from "../BookChapter";

export class BookLoader {
  constructor(
    private root: string,
    private readmePath: FilePath,
    private chapterPaths: DirectoryPath[],
  ) {}

  async loadSummary(): Promise<Summary> {
    return {
      readme: await this.loadReadmeHeading(),
      chapters: await this.loadChapterHeadings(),
    };
  }

  async loadBookChapters(): Promise<BookChapters> {
    const promises = this.chapterPaths.map(loadChapterContent);
    return Promise.all(promises).then(contents => ({ contents }));
  }

  private async loadReadmeHeading(): Promise<ReadmeHeading> {
    return loadReadme(this.readmePath);
  }

  private async loadChapterHeadings(): Promise<ChapterHeading[]> {
    console.log("loadChapters", this.root, this.chapterPaths);
    return Promise.all(this.chapterPaths.map(loadChapter));
  }
}

const fromMarkdown = (markdown: string) => md().render(markdown);

function loadReadme(path: FilePath): Promise<ReadmeHeading> {
  const fromHtml = (html: string) => {
    const $ = cheerio.load(html);
    return {
      title: $("h1").text(),
      path: path.toRelative,
    };
  };
  return promisify(readFile)(path.toAbsolute, "utf-8")
    .then(fromMarkdown)
    .then(fromHtml);
}

function toAnchor(text: string): string {
  return text
    .replace(/[.:]/g, "")
    .replace(/[ ]/g, "-")
    .toLowerCase();
}

async function loadChapterContent(
  chapterPath: DirectoryPath,
): Promise<ChapterContent> {
  const filePath = await chapterPath.withParent.confirmFile("index.md");
  const markdownString = await promisify(readFile)(
    filePath.toAbsolute,
    "utf-8",
  );
  return {
    filePath,
    markdownString,
  };
}

async function loadChapter(
  chapterPath: DirectoryPath,
  chapterIndex: number,
): Promise<ChapterHeading> {
  const index = await chapterPath.withParent.confirmFile("index.md");
  const fromHtml = (html: string) => {
    const $ = cheerio.load(html);
    const h1 = $("h1").text();
    return {
      title: `${chapterIndex + 1}. ${h1}`,
      path: index.toRelative,
    };
  };
  return promisify(readFile)(index.toAbsolute, "utf-8")
    .then(fromMarkdown)
    .then(fromHtml);
}
