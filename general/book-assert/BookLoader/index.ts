import { ChapterHeading, ReadmeHeading, Summary } from "../summary";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { confirm, FilePath } from "../../file-paths/FilePath";
import { promisify } from "util";
import { readFile } from "fs";
import * as md from "markdown-it";
import * as cheerio from "cheerio";
import { BookChapters } from "../BookChapter";
import { ChapterLoader } from "../BookIndexer";
import { ChapterContentsLoader } from "./ChapterContentsLoader";
import { BookReadme } from "../BookReadme";

export class BookLoader {
  constructor(
    private root: string,
    private loadChapter: ChapterLoader,
    private readme: ReadmeHeading,
    private chapterPaths: DirectoryPath[],
  ) {}

  async loadSummary(): Promise<Summary> {
    return {
      readme: await this.loadReadmeHeading(),
      chapters: await this.loadChapterHeadings(),
    };
  }

  async loadBookChapters(): Promise<BookChapters> {
    const promises = this.chapterPaths
      .map(ChapterContentsLoader.from(this.loadChapter))
      .map(_ => _.loadContents());

    const contents = await Promise.all(promises).then(_ =>
      _.reduce((a, b) => a.concat(b)),
    );
    return { contents };
  }

  async loadBookReadme(): Promise<BookReadme> {
    const filePath = await confirm.fromRelative(this.root, this.readme.path);
    return {
      markdownString: await promisify(readFile)(filePath.toAbsolute, "utf-8"),
      filePath,
    };
  }

  private async loadReadmeHeading(): Promise<ReadmeHeading> {
    // todo: confirm existence
    return Promise.resolve(this.readme);
  }

  private async loadChapterHeadings(): Promise<ChapterHeading[]> {
    console.log("loadChapters", this.root, this.chapterPaths);
    const promises = this.chapterPaths
      .map(ChapterContentsLoader.from(this.loadChapter))
      .map(_ => _.loadChapterHeading());

    return Promise.all(promises);
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
