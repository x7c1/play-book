import { FilePath } from "../../file-paths/FilePath";

export interface BookReadme {
  title: string;
  markdownString: string;
  filePath: FilePath;
}
