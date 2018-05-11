import { ChapterHeading, ReadmeHeading, Summary } from "./summary";
import { DirectoryPath } from "../file-paths/DirectoryPath";
import { FilePath } from "../file-paths/FilePath";

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
    // todo: load chapters
    return [];
  }
}
