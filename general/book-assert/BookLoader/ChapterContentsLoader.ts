import { ChapterLoader } from "../BookIndexer";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { ChapterContent } from "../BookChapter";
import { promisify } from "util";
import { readFile } from "fs";
import { basename } from "path";
import { ChapterHeading, PageHeading } from "../summary";
import * as cheerio from "cheerio";
import * as md from "markdown-it";

const warning = `
{% if false %}

* This file is automatically generated by book-assert library.
* Do not modify this file -- YOUR CHANGES WILL BE ERASED!

{% endif %}
`;

const fromMarkdown = (markdown: string) => md().render(markdown);

export class ChapterContentsLoader {
  constructor(
    private loadChapter: ChapterLoader,
    private chapterPath: DirectoryPath,
    private chapterIndex: number,
  ) {}

  static from = (loadChapter: ChapterLoader) => (
    chapterPath: DirectoryPath,
    chapterIndex: number,
  ) => new ChapterContentsLoader(loadChapter, chapterPath, chapterIndex);

  async loadContents(): Promise<ChapterContent[]> {
    const f = async (name: string) => {
      const filePath = await this.chapterPath.withParent.confirmFile(name);
      const markdownString = await promisify(readFile)(
        filePath.toAbsolute,
        "utf-8",
      );
      return {
        filePath,
        markdownString: warning + "\n" + markdownString,
      };
    };
    const nextPages = await this.loadNextPages();
    return Promise.all(
      [f("index.md")].concat(nextPages.map(page => f(basename(page.path)))),
    );
  }

  async loadChapterHeading(): Promise<ChapterHeading> {
    const index = await this.chapterPath.withParent.confirmFile("index.md");
    const nextPages = await this.loadNextPages();
    const fromHtml = (html: string) => {
      const $ = cheerio.load(html);
      const h1 = $("h1").text();
      return {
        title: `${this.chapterIndex + 1}. ${h1}`,
        path: index.toRelative,
        nextPages,
      };
    };
    return promisify(readFile)(index.toAbsolute, "utf-8")
      .then(fromMarkdown)
      .then(fromHtml);
  }

  private async loadNextPages(): Promise<PageHeading[]> {
    const chapter = await this.loadChapter(this.chapterIndex + 1);
    if (!chapter) {
      return Promise.resolve([]);
    }
    const promises = chapter.nextPages.map(async name => {
      const filePath = await this.chapterPath.withParent.confirmFile(name);
      const fromHtml = (html: string) => {
        const $ = cheerio.load(html);
        return {
          title: $("h1").text(),
          path: filePath.toRelative,
        };
      };
      return promisify(readFile)(filePath.toAbsolute, "utf-8")
        .then(fromMarkdown)
        .then(fromHtml);
    });
    return Promise.all(promises);
  }
}
