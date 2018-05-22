import { HasRelativePath } from "../../file-paths/HasRelativePath";

export interface ChapterContent {
  filePath: HasRelativePath;
  markdownString: string;
}

export interface BookChapters {
  contents: ChapterContent[];
}
