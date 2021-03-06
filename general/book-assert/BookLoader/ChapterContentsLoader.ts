import { ChapterLoader } from "../BookIndexer";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { ChapterContent } from "../BookChapter";
import { promisify } from "util";
import { readFile } from "fs";
import { basename } from "path";
import { ChapterHeading, PageHeading } from "../summary";
import * as cheerio from "cheerio";
import * as md from "markdown-it";
import { FilePath } from "../../file-paths/FilePath";
import { warning } from "./warning";

const fromMarkdown = (markdown: string) => md().render(markdown);

const toCheerio = (html: string) => cheerio.load(html);

type Parser<A> = (path: FilePath) => ($: CheerioStatic) => A;

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
    const fileNames: string[] = (await this.loadNextPages())
      .map(_ => _.path)
      .map(_ => basename(_));

    const contents = [this.defaultPage]
      .concat(fileNames)
      .map(this.confirmFile)
      .map(_ => _.then(this.toChapterContent));

    return Promise.all(contents);
  }

  async loadChapterHeading(): Promise<ChapterHeading> {
    const parse: Parser<Promise<ChapterHeading>> = index => async $ => {
      return {
        title: `${this.chapterNumber}. ${$("h1").text()}`,
        path: index.toRelative,
        nextPages: await this.loadNextPages(),
      };
    };
    return this.load(this.defaultPage, parse);
  }

  get defaultPage(): string {
    return "index.md";
  }

  private get chapterNumber(): number {
    return this.chapterIndex + 1;
  }

  private toChapterContent = (filePath: FilePath) => {
    return this.readFile(filePath).then(_ => ({
      filePath,
      markdownString: warning + "\n" + _,
    }));
  };

  private confirmFile = (fileName: string) => {
    return this.chapterPath.withParent.confirmFile(fileName);
  };

  private get nextPages(): Promise<string[]> {
    return this.loadChapter(this.chapterNumber).then(
      _ => (_ ? _.nextPages : []),
    );
  }

  private async loadNextPages(): Promise<PageHeading[]> {
    const parse: Parser<PageHeading> = path => $ => {
      return {
        title: $("h1").text(),
        path: path.toRelative,
      };
    };
    const pages = (await this.nextPages).map(name => this.load(name, parse));
    return Promise.all(pages);
  }

  private async load<A>(fileName: string, parse: Parser<A>): Promise<A> {
    const filePath = await this.confirmFile(fileName);
    return this.readFile(filePath)
      .then(fromMarkdown)
      .then(toCheerio)
      .then(parse(filePath));
  }

  private async readFile(file: FilePath) {
    return promisify(readFile)(file.toAbsolute, "utf-8");
  }
}
