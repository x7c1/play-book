import { ChapterHeading, ReadmeHeading, Summary } from "../summary";
import { DirectoryPath } from "../../file-paths/DirectoryPath";
import { BookChapters } from "../BookChapter";
import { ChapterLoader } from "../BookIndexer";
import { ChapterContentsLoader } from "./ChapterContentsLoader";
import { BookReadme } from "../BookReadme";
import { ReadmeLoader } from "./ReadmeLoader";

export class BookLoader {
  constructor(
    private root: string,
    private loadChapter: ChapterLoader,
    private readme: ReadmeHeading,
    private chapterPaths: DirectoryPath[],
  ) {}

  async loadSummary(): Promise<Summary> {
    return {
      readme: await this.loadBookReadme(),
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
    return new ReadmeLoader(this.readme).loadReadme();
  }

  private async loadChapterHeadings(): Promise<ChapterHeading[]> {
    console.log("loadChapters", this.root, this.chapterPaths);
    const promises = this.chapterPaths
      .map(ChapterContentsLoader.from(this.loadChapter))
      .map(_ => _.loadChapterHeading());

    return Promise.all(promises);
  }
}
