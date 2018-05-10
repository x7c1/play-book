import { Summary } from "./summary";
import { DirectoryPath } from "./DirectoryPath";

export interface Readme {
  title: string;
  path: string;
}

export class BookLoader {
  constructor(
    private root: string,
    private readmePath: string,
    private chapterPaths: DirectoryPath[],
  ) {}

  get readme(): Readme {
    return {
      title: "readme title",
      path: this.readmePath,
    };
  }

  loadSummary(): Promise<Summary> {
    console.log("loadSummary", this.chapterPaths);

    return Promise.resolve({
      readme: this.readme,

      // todo: load chapters
      chapters: [],
    });
  }
}
