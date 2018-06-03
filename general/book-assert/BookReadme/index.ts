import { HasRelativePath } from "../../file-paths/HasRelativePath";

export interface BookReadme {
  markdownString: string;
  filePath: HasRelativePath;
}
