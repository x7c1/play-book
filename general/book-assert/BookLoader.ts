import { ChapterHeading, ReadmeHeading, Summary } from "./summary";
import { DirectoryPath } from "../file-paths/DirectoryPath";

export class BookLoader {
  constructor(
    private root: string,
    private readmePath: string,
    private chapterPaths: DirectoryPath[],
  ) {}

  async loadSummary(): Promise<Summary> {
    console.log("loadSummary", this.chapterPaths);
    return {
      readme: await this.loadReadme(),
      chapters: await this.loadChapters(),
    };
  }

  private async loadReadme(): Promise<ReadmeHeading> {
    return {
      title: "readme title",
      path: this.readmePath,
    };
  }

  private async loadChapters(): Promise<ChapterHeading[]> {
    // todo: load chapters
    return [];
  }
}
